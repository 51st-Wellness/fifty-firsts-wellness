import React, { useEffect, useMemo, useState } from "react";
import "../styles/richtext.css";

type Props = {
  content: any;
  className?: string;
};

export default function RichTextWrapper({ content, className }: Props) {
  const [BlocksRenderer, setBlocksRenderer] =
    useState<null | React.ComponentType<any>>(null);

  useEffect(() => {
    let mounted = true;
    // Dynamic import to avoid hard dependency if package isn't installed yet
    import("@strapi/blocks-react-renderer")
      .then((m: any) => {
        if (mounted) setBlocksRenderer(() => m.BlocksRenderer);
      })
      .catch(() => {
        // silently fallback to local renderer
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Always call useMemo hook regardless of content
  const rendered = useMemo(() => renderBlocksFallback(content), [content]);

  if (!content) return null;

  if (BlocksRenderer) {
    return (
      <div className={`rt-content ${className ?? ""}`.trim()}>
        <BlocksRenderer
          content={content}
          blocks={{
            paragraph: ({ children }: { children: React.ReactNode }) => (
              <p>{children}</p>
            ),
            heading: ({
              children,
              level,
            }: {
              children: React.ReactNode;
              level: number;
            }) => {
              switch (level) {
                case 1:
                  return <h1>{children}</h1>;
                case 2:
                  return <h2>{children}</h2>;
                case 3:
                  return <h3>{children}</h3>;
                case 4:
                  return <h4>{children}</h4>;
                case 5:
                  return <h5>{children}</h5>;
                default:
                  return <h6>{children}</h6>;
              }
            },
            image: ({
              image,
            }: {
              image: { url: string; alternativeText?: string };
            }) => <img src={image.url} alt={image.alternativeText || ""} />,
            quote: ({ children }: { children: React.ReactNode }) => (
              <blockquote>{children}</blockquote>
            ),
            code: ({ children }: { children: React.ReactNode }) => (
              <pre>
                <code>{children}</code>
              </pre>
            ),
            list: ({
              children,
              format,
            }: {
              children: React.ReactNode;
              format: "ordered" | "unordered";
            }) =>
              format === "ordered" ? <ol>{children}</ol> : <ul>{children}</ul>,
            link: ({
              children,
              url,
            }: {
              children: React.ReactNode;
              url: string;
            }) => (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          }}
          modifiers={{
            bold: ({ children }: { children: React.ReactNode }) => (
              <strong>{children}</strong>
            ),
            italic: ({ children }: { children: React.ReactNode }) => (
              <em>{children}</em>
            ),
            underline: ({ children }: { children: React.ReactNode }) => (
              <u>{children}</u>
            ),
            strikethrough: ({ children }: { children: React.ReactNode }) => (
              <s>{children}</s>
            ),
            code: ({ children }: { children: React.ReactNode }) => (
              <code>{children}</code>
            ),
          }}
        />
      </div>
    );
  }

  // Fallback minimal renderer for common blocks if the package isn't available
  return (
    <div className={`rt-content ${className ?? ""}`.trim()}>{rendered}</div>
  );
}

function renderBlocksFallback(content: any): React.ReactNode {
  if (!Array.isArray(content)) return null;
  return content.map((block: any, idx: number) => {
    switch (block.type) {
      case "paragraph":
        return <p key={idx}>{inlineChildren(block.children)}</p>;
      case "link":
        return (
          <a
            key={idx}
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {inlineChildren(block.children)}
          </a>
        );
      case "heading": {
        const level = block.level || 2;
        const kids = inlineChildren(block.children);
        if (level === 1) return <h1 key={idx}>{kids}</h1>;
        if (level === 2) return <h2 key={idx}>{kids}</h2>;
        if (level === 3) return <h3 key={idx}>{kids}</h3>;
        if (level === 4) return <h4 key={idx}>{kids}</h4>;
        if (level === 5) return <h5 key={idx}>{kids}</h5>;
        return <h6 key={idx}>{kids}</h6>;
      }
      case "image":
        return (
          <img
            key={idx}
            src={block.image?.url}
            alt={block.image?.alternativeText || ""}
          />
        );
      case "quote":
        return (
          <blockquote key={idx}>{inlineChildren(block.children)}</blockquote>
        );
      case "list":
        return block.format === "ordered" ? (
          <ol key={idx}>
            {(block.children || []).map((li: any, liIdx: number) => (
              <li key={liIdx}>{inlineChildren(li.children)}</li>
            ))}
          </ol>
        ) : (
          <ul key={idx}>
            {(block.children || []).map((li: any, liIdx: number) => (
              <li key={liIdx}>{inlineChildren(li.children)}</li>
            ))}
          </ul>
        );
      case "code":
        return (
          <pre key={idx}>
            <code>{block.children?.[0]?.text || ""}</code>
          </pre>
        );
      default:
        return null;
    }
  });
}

function inlineChildren(children: any[]): React.ReactNode {
  if (!Array.isArray(children)) return null;
  return children.map((n, i) => {
    // Inline link node (e.g., inside paragraph children)
    if (n.type === "link") {
      return (
        <a
          key={`a-${i}`}
          href={n.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {inlineChildren(n.children)}
        </a>
      );
    }
    let node: React.ReactNode = n.text ?? null;
    if (n.bold) node = <strong key={`b-${i}`}>{node}</strong>;
    if (n.italic) node = <em key={`i-${i}`}>{node}</em>;
    if (n.underline) node = <u key={`u-${i}`}>{node}</u>;
    if (n.strikethrough) node = <s key={`s-${i}`}>{node}</s>;
    if (n.code) node = <code key={`c-${i}`}>{node}</code>;
    return <React.Fragment key={i}>{node}</React.Fragment>;
  });
}
