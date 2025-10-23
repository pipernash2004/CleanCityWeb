import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

type Status = "pending" | "in-progress" | "resolved";

interface StatusBadgeProps {
  status: Status;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    icon: Clock,
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
    icon: AlertCircle,
  },
  resolved: {
    label: "Resolved",
    className: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
    icon: CheckCircle,
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={`${config.className} gap-1`} data-testid={`badge-status-${status}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}
