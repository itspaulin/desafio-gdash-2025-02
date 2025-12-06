interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-300 text-gray-900 hover:bg-gray-100",
    success: "bg-green-500 text-white hover:bg-green-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
