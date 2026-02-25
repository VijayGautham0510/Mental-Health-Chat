import { Leaf, Menu, LogOut } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  onSwitchUser: () => void;
}

export function Header({ onMenuClick, onSwitchUser }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--color-warm-bg)]/80 backdrop-blur-md border-b border-[var(--color-warm-border)]">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 hover:bg-[var(--color-warm-olive)]/10 rounded-full transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-[var(--color-warm-text)]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-warm-olive)] flex items-center justify-center text-white">
              <Leaf className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-serif font-medium text-[var(--color-warm-text)]">
              SereneMind
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchUser}
            className="hidden sm:flex items-center gap-2 text-xs font-medium text-[var(--color-warm-muted)] hover:text-[var(--color-warm-olive)] transition-colors"
            title="Switch Profile"
          >
            <LogOut className="w-4 h-4" />
            Switch
          </button>
          <div className="text-xs font-medium text-[var(--color-warm-olive)] bg-[var(--color-warm-olive)]/10 px-3 py-1 rounded-full">
            Beta
          </div>
        </div>
      </div>
    </header>
  );
}
