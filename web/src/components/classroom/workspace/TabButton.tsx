interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  count: number;
}

export default function TabButton({ icon, label, isActive, onClick, count }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors duration-200 font-medium text-sm ${
        isActive
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
      <span className="ml-2 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
        {count}
      </span>
    </button>
  );
}