import React, { useState, useEffect, useRef } from "react";
import {
  Conversation,
  ChatMessage,
  UserProfile,
  UserSettings,
  ToolMode,
  ChatAttachment,
} from "./types";
import {
  getStoredConversations,
  saveConversations,
  getStoredSettings,
  saveSettings,
  getStoredUser,
  saveUser,
} from "./utils/storage";
import { Navbar, NavTab } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ChatView } from "./components/ChatView";
import { HomeView } from "./components/HomeView";
import { ToolsView } from "./components/ToolsView";
import { DashboardView } from "./components/DashboardView";
import { SettingsView } from "./components/SettingsView";
import { AuthModal } from "./components/AuthModal";
import {
  getClientGeminiApiKey,
  generateClientSideGeminiStream,
} from "./services/clientGemini";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("home");
  const [conversations, setConversations] = useState<Conversation[]>(getStoredConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    const list = getStoredConversations();
    return list.length > 0 ? list[0].id : null;
  });
  const [user, setUser] = useState<UserProfile>(getStoredUser);
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  // Apply dark or light mode class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [settings.theme]);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || null;

  // Create a new conversation
  const handleNewChat = (toolMode: ToolMode = "general", initialPrompt?: string) => {
    const newConv: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: "New Conversation",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      toolMode,
      messages: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setCurrentTab("chat");

    if (initialPrompt) {
      setTimeout(() => {
        handleSendMessage(initialPrompt, undefined, newConv.id);
      }, 50);
    }
  };

  // Start chat from homepage or tools page
  const handleStartChat = (initialPrompt?: string, toolMode: ToolMode = "general") => {
    if (initialPrompt) {
      handleNewChat(toolMode, initialPrompt);
    } else {
      if (!activeConversationId || !activeConversation) {
        handleNewChat(toolMode);
      } else {
        setCurrentTab("chat");
      }
    }
  };

  // Send message to DLICOM AI via backend API route
  const handleSendMessage = async (
    content: string,
    attachment?: ChatAttachment,
    targetConversationId?: string
  ) => {
    const convId = targetConversationId || activeConversationId;
    let targetConv = conversations.find((c) => c.id === convId);

    if (!targetConv) {
      // Create new conversation on the fly
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        title: content.slice(0, 36) || "New Conversation",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        toolMode: "general",
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      targetConv = newConv;
    }

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      content,
      timestamp: Date.now(),
      attachment,
    };

    const assistantMessageId = `msg_asst_${Date.now() + 1}`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: Date.now() + 1,
    };

    // Update conversation title if it's the first message
    const updatedTitle =
      targetConv.messages.length === 0
        ? content.trim().slice(0, 36) || "Dili Ai Chat"
        : targetConv.title;

    // Update state with user message + placeholder assistant message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === targetConv!.id) {
          return {
            ...c,
            title: updatedTitle,
            updatedAt: Date.now(),
            messages: [...c.messages, userMessage, assistantMessage],
          };
        }
        return c;
      })
    );

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    try {
      // Build conversation payload for Gemini API
      const historyPayload = [...targetConv.messages, userMessage].map((m) => {
        return {
          role: m.role === "assistant" ? "model" : "user",
          content: m.content,
          image:
            m.attachment && m.attachment.mimeType.startsWith("image/")
              ? {
                  data: m.attachment.dataUrl,
                  mimeType: m.attachment.mimeType,
                }
              : undefined,
        };
      });

      let responseSuccess = false;
      let fullText = "";
      let lastApiError: string | null = null;

      // Step 1: Try Streaming SSE request to /api/chat/stream
      if (settings.enableStreaming) {
        try {
          const response = await fetch("/api/chat/stream", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: abortControllerRef.current.signal,
            body: JSON.stringify({
              messages: historyPayload,
              toolMode: targetConv.toolMode,
              stylePreference: settings.stylePreference,
              temperature: settings.temperature,
            }),
          });

          if (response.ok) {
            const reader = response.body?.getReader();
            const decoder = new TextDecoder("utf-8");

            if (reader) {
              let buffer = "";

              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const rawLines = buffer.split(/\r?\n/);
                buffer = rawLines.pop() || "";

                for (const rawLine of rawLines) {
                  const line = rawLine.trim();
                  if (!line || !line.startsWith("data:")) continue;
                  const jsonStr = line.slice(5).trim();
                  if (!jsonStr) continue;

                  let parsed: any;
                  try {
                    parsed = JSON.parse(jsonStr);
                  } catch {
                    continue;
                  }

                  if (parsed.error) {
                    lastApiError = parsed.error;
                    throw new Error(parsed.error);
                  }

                  if (parsed.text) {
                    fullText += parsed.text;
                    const textSoFar = fullText;
                    setConversations((prev) =>
                      prev.map((c) => {
                        if (c.id === targetConv!.id) {
                          return {
                            ...c,
                            messages: c.messages.map((m) =>
                              m.id === assistantMessageId ? { ...m, content: textSoFar } : m
                            ),
                          };
                        }
                        return c;
                      })
                    );
                  }
                }
              }

              if (fullText.trim().length > 0) {
                responseSuccess = true;
              }
            }
          } else {
            const errData = await response.json().catch(() => ({}));
            if (errData.error) {
              lastApiError = errData.error;
            } else if (response.status !== 404) {
              lastApiError = `Server responded with status ${response.status}`;
            }
          }
        } catch (streamErr: any) {
          if (streamErr.name === "AbortError") throw streamErr;
          if (streamErr.message && !lastApiError) {
            lastApiError = streamErr.message;
          }
          console.warn("Streaming SSE encountered issue, attempting non-stream fallback:", streamErr?.message);
        }
      }

      // Step 2: Try non-streaming /api/chat fallback
      if (!responseSuccess) {
        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: abortControllerRef.current.signal,
            body: JSON.stringify({
              messages: historyPayload,
              toolMode: targetConv.toolMode,
              stylePreference: settings.stylePreference,
              temperature: settings.temperature,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.text) {
              responseSuccess = true;
              fullText = data.text;
              setConversations((prev) =>
                prev.map((c) => {
                  if (c.id === targetConv!.id) {
                    return {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMessageId ? { ...m, content: data.text } : m
                      ),
                    };
                  }
                  return c;
                })
              );
            } else if (data.error) {
              lastApiError = data.error;
            }
          } else {
            const errData = await response.json().catch(() => ({}));
            lastApiError = errData.error || lastApiError || `Server responded with status ${response.status}`;
          }
        } catch (chatErr: any) {
          if (chatErr.name === "AbortError") throw chatErr;
          if (chatErr.message && !lastApiError) {
            lastApiError = chatErr.message;
          }
          console.warn("Non-stream endpoint attempt encountered issue:", chatErr?.message);
        }
      }

      // Step 3: Fallback to direct client-side Gemini if VITE_GEMINI_API_KEY is configured
      if (!responseSuccess) {
        const clientKey = getClientGeminiApiKey();
        if (clientKey) {
          try {
            fullText = "";
            await generateClientSideGeminiStream({
              messages: historyPayload,
              toolMode: targetConv.toolMode,
              stylePreference: settings.stylePreference,
              temperature: settings.temperature,
              onChunk: (chunk) => {
                fullText += chunk;
                const textSoFar = fullText;
                setConversations((prev) =>
                  prev.map((c) => {
                    if (c.id === targetConv!.id) {
                      return {
                        ...c,
                        messages: c.messages.map((m) =>
                          m.id === assistantMessageId ? { ...m, content: textSoFar } : m
                        ),
                      };
                    }
                    return c;
                  })
                );
              },
            });
            responseSuccess = true;
          } catch (clientErr: any) {
            if (clientErr.name === "AbortError") throw clientErr;
            lastApiError = clientErr.message || lastApiError;
          }
        }
      }

      // Step 4: If still unhandled, throw the actual captured error or clear guidance
      if (!responseSuccess) {
        throw new Error(
          lastApiError ||
            "Unable to communicate with Dili Ai. Please ensure GEMINI_API_KEY is configured in your deployment settings."
        );
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Generation stopped by user.");
      } else {
        console.error("Chat error:", err);
        const errorMessage = `⚠️ **Dili Ai Notice**: ${
          err.message || "Failed to communicate with AI model. Please verify your GEMINI_API_KEY."
        }`;

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === targetConv!.id) {
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: m.content ? `${m.content}\n\n${errorMessage}` : errorMessage }
                    : m
                ),
              };
            }
            return c;
          })
        );
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Stop Generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  // Regenerate last response
  const handleRegenerate = async () => {
    if (!activeConversation || isGenerating) return;
    const msgs = activeConversation.messages;
    if (msgs.length === 0) return;

    // Find last user message
    let lastUserMessage: ChatMessage | null = null;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "user") {
        lastUserMessage = msgs[i];
        break;
      }
    }

    if (!lastUserMessage) return;

    // Remove the last assistant message and re-run
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          const newMsgs = [...c.messages];
          if (newMsgs[newMsgs.length - 1].role === "assistant") {
            newMsgs.pop();
          }
          return { ...c, messages: newMsgs };
        }
        return c;
      })
    );

    await handleSendMessage(lastUserMessage.content, lastUserMessage.attachment);
  };

  // Delete a conversation
  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = conversations.filter((c) => c.id !== id);
    setConversations(remaining);
    if (activeConversationId === id) {
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Toggle Pin
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  // Update Title
  const handleUpdateTitle = (newTitle: string) => {
    if (!activeConversationId) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversationId ? { ...c, title: newTitle } : c))
    );
  };

  // Clear messages in current chat
  const handleClearCurrentMessages = () => {
    if (!activeConversationId) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversationId ? { ...c, messages: [] } : c))
    );
  };

  // Switch Tool Mode for current chat
  const handleSelectToolMode = (mode: ToolMode) => {
    if (!activeConversationId) {
      handleNewChat(mode);
      return;
    }
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversationId ? { ...c, toolMode: mode } : c))
    );
  };

  // Clear all history (Settings action)
  const handleClearAllHistory = () => {
    setConversations([]);
    setActiveConversationId(null);
    handleNewChat("general");
  };

  // Export conversations to JSON
  const handleExportHistory = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(conversations, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `dlicom_ai_history_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Logout
  const handleLogout = () => {
    setUser({
      id: "guest_user",
      name: "Guest User",
      email: "guest@dlicom.ai",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      tier: "Free",
      joinedDate: "Today",
      isAuthenticated: false,
    });
  };

  const isDark = settings.theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark
          ? "bg-[#070a12] text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat tab includes Sidebar + ChatView */}
        {currentTab === "chat" ? (
          <>
            <Sidebar
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={(id) => {
                setActiveConversationId(id);
                setCurrentTab("chat");
              }}
              onNewChat={() => handleNewChat("general")}
              onDeleteConversation={handleDeleteConversation}
              onTogglePin={handleTogglePin}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onOpenSettings={() => setCurrentTab("settings")}
              onOpenDashboard={() => setCurrentTab("dashboard")}
              onOpenWhoMadeThis={() => {
                setCurrentTab("home");
                setTimeout(() => {
                  document.getElementById("who-made-this")?.scrollIntoView({ behavior: "smooth" });
                }, 120);
              }}
              user={user}
              isDark={isDark}
            />

            <main className="flex-1 flex flex-col min-w-0 bg-transparent">
              <ChatView
                conversation={activeConversation}
                onSendMessage={handleSendMessage}
                onRegenerate={handleRegenerate}
                onStopGeneration={handleStopGeneration}
                isGenerating={isGenerating}
                onUpdateTitle={handleUpdateTitle}
                onClearMessages={handleClearCurrentMessages}
                onSelectToolMode={handleSelectToolMode}
                user={user}
                settings={settings}
                isDark={isDark}
                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
              />
            </main>
          </>
        ) : currentTab === "home" ? (
          <HomeView onStartChat={handleStartChat} isDark={isDark} />
        ) : currentTab === "tools" ? (
          <ToolsView
            onSelectTool={(toolId, customPrompt) =>
              handleStartChat(customPrompt, toolId)
            }
            isDark={isDark}
          />
        ) : currentTab === "dashboard" ? (
          <DashboardView
            conversations={conversations}
            user={user}
            onOpenConversation={(id) => {
              setActiveConversationId(id);
              setCurrentTab("chat");
            }}
            onDeleteConversation={handleDeleteConversation}
            onNewChat={() => handleNewChat("general")}
            onOpenSettings={() => setCurrentTab("settings")}
            isDark={isDark}
          />
        ) : currentTab === "settings" ? (
          <SettingsView
            settings={settings}
            user={user}
            onUpdateSettings={(newSettings) =>
              setSettings((prev) => ({ ...prev, ...newSettings }))
            }
            onUpdateUser={(newUser) =>
              setUser((prev) => ({ ...prev, ...newUser }))
            }
            onClearHistory={handleClearAllHistory}
            onLogout={handleLogout}
            isDark={isDark}
            onExportHistory={handleExportHistory}
          />
        ) : null}
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
        }}
        isDark={isDark}
      />
    </div>
  );
}
