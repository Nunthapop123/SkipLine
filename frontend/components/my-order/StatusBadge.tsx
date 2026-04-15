type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = status?.toUpperCase();

  const styles: Record<string, string> = {
    PREPARING: "bg-[#F5A623] text-white",
    CONFIRMED: "bg-[#C5CCE0] text-[#3D5690]",
    READY: "bg-[#A8D5B5] text-[#2A6040]",
    COMPLETED: "bg-[#D4D2C8] text-[#3D5690]/70",
  };

  const labels: Record<string, string> = {
    CONFIRMED: "Confirmed",
    PREPARING: "Preparing",
    READY: "Ready to pick up",
    COMPLETED: "Completed",
  };

  return (
    <span
      className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${
        styles[s] ?? "bg-[#D4D2C8] text-[#3D5690]/70"
      }`}
    >
      {labels[s] ?? status}
    </span>
  );
}
