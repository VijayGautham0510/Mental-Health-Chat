import { useState } from "react";
import { motion } from "motion/react";
import { User, Heart, Calendar, Users } from "lucide-react";
import { cn } from "../lib/utils";

interface OnboardingProps {
  onComplete: (details: { id: string; name: string; age: number; gender: "male" | "female" | "other" }) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female" | "other" | null>(null);

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2 && age) {
      const ageNum = parseInt(age);
      if (!isNaN(ageNum) && ageNum > 0 && ageNum < 120) {
        setStep(3);
      }
    } else if (step === 3 && gender) {
      const ageNum = parseInt(age);
      onComplete({ id: Date.now().toString(), name, age: ageNum, gender });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

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
            Welcome to SereneMind
          </h2>
          <p className="text-center text-[var(--color-warm-muted)] mb-8">
            Help us personalize your experience.
          </p>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">What should we call you?</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-warm-olive)] focus:ring-1 focus:ring-[var(--color-warm-olive)] outline-none transition-all bg-white/50"
                    placeholder="Your name"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">How old are you?</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-warm-olive)] focus:ring-1 focus:ring-[var(--color-warm-olive)] outline-none transition-all bg-white/50"
                    placeholder="Your age"
                    autoFocus
                    min="1"
                    max="120"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <label className="text-sm font-medium ml-1">How do you identify?</label>
              <div className="grid grid-cols-1 gap-3">
                {(["male", "female", "other"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={cn(
                      "w-full py-3 px-4 rounded-xl border text-left transition-all flex items-center justify-between group",
                      gender === g
                        ? "border-[var(--color-warm-olive)] bg-[var(--color-warm-olive)]/10 text-[var(--color-warm-olive)]"
                        : "border-gray-200 hover:border-[var(--color-warm-olive)]/50 bg-white/50"
                    )}
                  >
                    <span className="capitalize">{g}</span>
                    {gender === g && <div className="w-2 h-2 rounded-full bg-[var(--color-warm-olive)]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                className="px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !name.trim()) ||
                (step === 2 && !age) ||
                (step === 3 && !gender)
              }
              className="flex-1 bg-[var(--color-warm-olive)] text-white py-3 rounded-xl font-medium hover:bg-[var(--color-warm-olive-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-[var(--color-warm-olive)]/20"
            >
              {step === 3 ? "Get Started" : "Continue"}
            </button>
          </div>
          
          <div className="mt-6 flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  step >= i ? "bg-[var(--color-warm-olive)]" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
