import React, { useMemo } from "react";
import { marked } from "marked";
import { CodeBlock } from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Parse content into blocks: code blocks vs markdown chunks
  const blocks = useMemo(() => {
    if (!content) return [];

    const codeBlockRegex = /```([a-zA-Z0-9_\-#+]*)\n([\s\S]*?)```/g;
    const segments: Array<{ type: "code" | "markdown"; content: string; lang?: string }> = [];

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          type: "markdown",
          content: content.slice(lastIndex, match.index),
        });
      }

      segments.push({
        type: "code",
        lang: match[1] || "text",
        content: match[2].trimEnd(),
      });

      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      segments.push({
        type: "markdown",
        content: content.slice(lastIndex),
      });
    }

    return segments;
  }, [content]);

  return (
    <div className="markdown-body space-y-3 leading-relaxed text-[15px]">
      {blocks.map((block, idx) => {
        if (block.type === "code") {
          return (
            <CodeBlock
              key={`code-${idx}`}
              language={block.lang}
              code={block.content}
            />
          );
        }

        // Render HTML for regular markdown chunks
        const html = marked.parse(block.content, {
          breaks: true,
          gfm: true,
        });

        return (
          <div
            key={`md-${idx}`}
            className="prose-clean"
            dangerouslySetInnerHTML={{ __html: html as string }}
          />
        );
      })}
    </div>
  );
};
