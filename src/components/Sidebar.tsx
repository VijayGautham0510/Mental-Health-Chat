import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Plus, Trash2, X } from "lucide-react";
import { cn } from "../lib/utils";

interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-[var(--color-warm-border)] z-50 flex flex-col shadow-xl"
          >
            <div className="p-4 border-b border-[var(--color-warm-border)] flex items-center justify-between">
              <h2 className="font-serif font-medium text-lg text-[var(--color-warm-text)]">
                Your Conversations
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full lg:hidden"
              >
                <X className="w-5 h-5 text-[var(--color-warm-muted)]" />
              </button>
            </div>

            <div className="p-4">
              <button
                onClick={() => {
                  onNewChat();
                  if (window.innerWidth < 1024) onClose();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[var(--color-warm-olive)] text-white py-3 rounded-xl font-medium hover:bg-[var(--color-warm-olive-hover)] transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
                New Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
              {sessions.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-warm-muted)] text-sm">
                  No previous conversations.
                </div>
              ) : (
                sessions
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        "group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border",
                        currentSessionId === session.id
                          ? "bg-[var(--color-warm-bg)] border-[var(--color-warm-olive)]/20"
                          : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                      )}
                      onClick={() => {
                        onSelectSession(session.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <MessageSquare className={cn(
                          "w-4 h-4 flex-shrink-0",
                          currentSessionId === session.id ? "text-[var(--color-warm-olive)]" : "text-gray-400"
                        )} />
                        <span className={cn(
                          "text-sm truncate font-medium",
                          currentSessionId === session.id ? "text-[var(--color-warm-text)]" : "text-[var(--color-warm-muted)]"
                        )}>
                          {session.title}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                        title="Delete chat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
