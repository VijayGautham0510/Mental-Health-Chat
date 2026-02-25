import { motion } from "motion/react";
import { User, Plus, Heart } from "lucide-react";
import { cn } from "../lib/utils";

interface UserDetails {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
}

interface UserSelectorProps {
  users: UserDetails[];
  onSelect: (user: UserDetails) => void;
  onNewUser: () => void;
}

export function UserSelector({ users, onSelect, onNewUser }: UserSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-warm-bg)]/90 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-[var(--color-warm-border)] overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-warm-olive)]/10 flex items-center justify-center text-[var(--color-warm-olive)]">
              <Heart className="w-8 h-8 fill-current" />
            </div>
          </div>

          <h2 className="text-2xl font-serif font-medium text-center text-[var(--color-warm-text)] mb-2">
            Who is chatting today?
          </h2>
          <p className="text-center text-[var(--color-warm-muted)] mb-8">
            Select your profile to continue.
          </p>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => onSelect(user)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white/50 hover:bg-white hover:border-[var(--color-warm-olive)]/30 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--color-warm-olive)]/10 flex items-center justify-center text-[var(--color-warm-olive)] group-hover:bg-[var(--color-warm-olive)] group-hover:text-white transition-colors">
                  <User className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-[var(--color-warm-text)]">{user.name}</div>
                  <div className="text-xs text-[var(--color-warm-muted)]">
                    {user.age} years old • {user.gender}
                  </div>
                </div>
              </button>
            ))}

            <button
              onClick={onNewUser}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-dashed border-gray-300 hover:border-[var(--color-warm-olive)] hover:bg-[var(--color-warm-olive)]/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[var(--color-warm-olive)]/10 group-hover:text-[var(--color-warm-olive)] transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-500 group-hover:text-[var(--color-warm-olive)]">Add new profile</div>
                <div className="text-xs text-gray-400">Create a fresh start</div>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
