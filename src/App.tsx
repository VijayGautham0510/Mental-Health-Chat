/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Header } from "./components/Header";
import { MessageBubble } from "./components/MessageBubble";
import { InputArea } from "./components/InputArea";
import { Onboarding } from "./components/Onboarding";
import { Sidebar } from "./components/Sidebar";
import { UserSelector } from "./components/UserSelector";
import { sendMessage } from "./services/gemini";
import { motion, AnimatePresence } from "motion/react";
import { LogOut } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
}

interface UserDetails {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
}

interface ChatSession {
  id: string;
  userId: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

export default function App() {
  const [user, setUser] = useState<UserDetails | null>(() => {
    const saved = localStorage.getItem("serene_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.name && parsed.age && parsed.gender) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
    return null;
  });

  const [allUsers, setAllUsers] = useState<UserDetails[]>(() => {
    const saved = localStorage.getItem("serene_all_users");
    return saved ? JSON.parse(saved) : [];
  });

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("serene_sessions");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist all users
  useEffect(() => {
    localStorage.setItem("serene_all_users", JSON.stringify(allUsers));
  }, [allUsers]);

  // Persist current user
  useEffect(() => {
    if (user) {
      localStorage.setItem("serene_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("serene_user");
    }
  }, [user]);

  // Persist sessions
  useEffect(() => {
    localStorage.setItem("serene_sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Initialize or load session
  useEffect(() => {
    if (user && !currentSessionId) {
      const userSessions = sessions.filter(s => s.userId === user.id);
      if (userSessions.length > 0) {
        // Load most recent session for this user
        const mostRecent = userSessions.sort((a, b) => b.timestamp - a.timestamp)[0];
        setCurrentSessionId(mostRecent.id);
        setMessages(mostRecent.messages);
      } else {
        createNewSession();
      }
    }
  }, [user, currentSessionId]);

  const createNewSession = () => {
    if (!user) return;
    
    const newSessionId = Date.now().toString();
    const initialMessage: Message = {
      id: "welcome",
      role: "model",
      content: `Hello ${user.name}. I'm Serene. I'm here to listen and support you. How are you feeling today?`,
    };

    const newSession: ChatSession = {
      id: newSessionId,
      userId: user.id,
      title: "New Conversation",
      timestamp: Date.now(),
      messages: [initialMessage],
    };

    setSessions((prev) => [...prev, newSession]);
    setCurrentSessionId(newSessionId);
    setMessages([initialMessage]);
    setIsSidebarOpen(false);
  };

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setMessages([]);
    }
  };

  const handleOnboardingComplete = (details: UserDetails) => {
    setAllUsers(prev => [...prev, details]);
    setUser(details);
    setIsAddingUser(false);
  };

  const handleSwitchUser = () => {
    setUser(null);
    setCurrentSessionId(null);
    setMessages([]);
    setIsAddingUser(false);
  };

  const updateCurrentSession = (newMessages: Message[]) => {
    if (!currentSessionId) return;

    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === currentSessionId) {
          // Update title based on first user message if it's "New Conversation"
          let title = session.title;
          if (title === "New Conversation") {
            const firstUserMsg = newMessages.find((m) => m.role === "user");
            if (firstUserMsg) {
              title = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? "..." : "");
            }
          }
          return { ...session, messages: newMessages, title, timestamp: Date.now() };
        }
        return session;
      })
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    updateCurrentSession(updatedMessages);
    setIsLoading(true);

    try {
      // Format history for Gemini API
      const history = updatedMessages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

      const responseText = await sendMessage(history, text, user || undefined);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: responseText || "I'm having trouble connecting right now. Please try again.",
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      updateCurrentSession(finalMessages);
    } catch (error) {
      console.error("Failed to get response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    if (allUsers.length > 0 && !isAddingUser) {
      return (
        <UserSelector
          users={allUsers}
          onSelect={setUser}
          onNewUser={() => setIsAddingUser(true)}
        />
      );
    }
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const userSessions = sessions.filter(s => s.userId === user.id);

  return (
    <div className="flex flex-col h-screen font-sans overflow-hidden relative">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 z-0 bg-[var(--color-warm-bg)]">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#E8E8E0] blur-3xl opacity-60 animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#DCDCD5] blur-3xl opacity-60 animate-pulse" style={{ animationDuration: "10s", animationDelay: "1s" }} />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#F0F0EB] blur-3xl opacity-40 animate-pulse" style={{ animationDuration: "12s", animationDelay: "2s" }} />
      </div>

      <Header onMenuClick={() => setIsSidebarOpen(true)} onSwitchUser={handleSwitchUser} />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={userSessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={createNewSession}
        onDeleteSession={handleDeleteSession}
      />

      <main className="flex-1 overflow-y-auto pt-20 pb-4 px-4 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6 min-h-full flex flex-col justify-end">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-[var(--color-warm-muted)]">
              Start a new conversation...
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
              ))}
            </AnimatePresence>
          )}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start w-full"
            >
              <div className="bg-white px-5 py-4 rounded-2xl rounded-bl-none shadow-sm border border-[var(--color-warm-border)] flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--color-warm-olive)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-[var(--color-warm-olive)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-[var(--color-warm-olive)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="p-4 bg-[var(--color-warm-bg)]/95 backdrop-blur-sm border-t border-[var(--color-warm-border)] z-30">
        <InputArea onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
