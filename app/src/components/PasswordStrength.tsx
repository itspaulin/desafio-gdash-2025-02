import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  { label: "Mínimo de 8 caracteres", test: (p) => p.length >= 8 },
  { label: "Uma letra minúscula", test: (p) => /[a-z]/.test(p) },
  { label: "Uma letra maiúscula", test: (p) => /[A-Z]/.test(p) },
  { label: "Um número", test: (p) => /[0-9]/.test(p) },
  { label: "Um caractere especial", test: (p) => /[^a-zA-Z0-9]/.test(p) },
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const passedRequirements = requirements.filter((req) => req.test(password));
  const strength = passedRequirements.length;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              strength === 0
                ? "w-0"
                : strength <= 2
                ? "w-1/3 bg-red-500"
                : strength <= 4
                ? "w-2/3 bg-yellow-500"
                : "w-full bg-green-500"
            }`}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {strength === 0
            ? "Muito fraca"
            : strength <= 2
            ? "Fraca"
            : strength <= 4
            ? "Média"
            : "Forte"}
        </span>
      </div>

      <ul className="space-y-1">
        {requirements.map((req, index) => {
          const passed = req.test(password);
          return (
            <li
              key={index}
              className={`text-xs flex items-center gap-1.5 ${
                passed ? "text-green-600" : "text-slate-400"
              }`}
            >
              {passed ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              {req.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
