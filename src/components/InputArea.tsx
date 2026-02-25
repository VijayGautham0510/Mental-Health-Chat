import { Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";

interface InputAreaProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function InputArea({ onSend, isLoading }: InputAreaProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-white p-2 rounded-3xl shadow-sm border border-[var(--color-warm-border)] focus-within:ring-2 focus-within:ring-[var(--color-warm-olive)]/20 transition-all duration-200"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share your thoughts..."
          rows={1}
          className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-3 px-4 max-h-[150px] min-h-[44px] text-[var(--color-warm-text)] placeholder:text-[var(--color-warm-muted)]"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={cn(
            "p-3 rounded-full transition-colors duration-200 flex-shrink-0 mb-1 mr-1",
            input.trim() && !isLoading
              ? "bg-[var(--color-warm-olive)] text-white hover:bg-[var(--color-warm-olive-hover)]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
      <p className="text-center text-xs text-[var(--color-warm-muted)] mt-3 font-serif italic">
        Serene is an AI companion, not a human. For immediate help, please contact emergency services.
      </p>
    </div>
  );
}
