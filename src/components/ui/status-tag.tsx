type StatusType =
  | "active"
  | "new"
  | "past"
  | "unknown"
  | "ended";

const statusConfig: Record<
  StatusType,
  { label: string; bgColor: string; textColor: string }
> = {
  active: {
    label: "募集中",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  new: {
    label: "新着",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  past: {
    label: "過去掲載あり",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  unknown: {
    label: "現在確認なし",
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
  },
  ended: {
    label: "終了",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
  },
};

interface StatusTagProps {
  status: StatusType;
  className?: string;
}

export function StatusTag({ status, className = "" }: StatusTagProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.label}
    </span>
  );
}
