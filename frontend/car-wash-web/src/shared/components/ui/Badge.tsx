import { Clock, CheckCircle, Loader, CheckCircle2, XCircle } from "lucide-react";

type BadgeVariant = "pending" | "confirmed" | "inProgress" | "completed" | "cancelled";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const config: Record<
  BadgeVariant,
  { icon: React.ElementType; defaultLabel: string; classes: string; spin?: boolean }
> = {
  pending: {
    icon: Clock,
    defaultLabel: "Pending",
    classes: "bg-gray-100 text-gray-600",
  },
  confirmed: {
    icon: CheckCircle,
    defaultLabel: "Confirmed",
    classes: "bg-blue-50 text-blue-700",
  },
  inProgress: {
    icon: Loader,
    defaultLabel: "In Progress",
    classes: "bg-amber-50 text-amber-700",
    spin: true,
  },
  completed: {
    icon: CheckCircle2,
    defaultLabel: "Completed",
    classes: "bg-green-50 text-green-700",
  },
  cancelled: {
    icon: XCircle,
    defaultLabel: "Cancelled",
    classes: "bg-red-50 text-red-700",
  },
};

export function Badge({ variant, label }: BadgeProps) {
  const { icon: Icon, defaultLabel, classes, spin } = config[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${classes}`}
    >
      <Icon className={`w-3 h-3${spin ? " animate-spin" : ""}`} />
      {label ?? defaultLabel}
    </span>
  );
}
