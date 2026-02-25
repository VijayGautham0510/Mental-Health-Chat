import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";

interface MessageBubbleProps {
  role: "user" | "model";
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[70%] px-5 py-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm",
          isUser
            ? "bg-[var(--color-warm-olive)] text-white rounded-br-none"
            : "bg-white text-[var(--color-warm-text)] border border-[var(--color-warm-border)] rounded-bl-none"
        )}
      >
        <div className="markdown-body prose prose-sm prose-p:my-1 prose-headings:my-2 max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
