"use client";

import { ClipboardList, Timer, Flame, CheckCircle2 } from "lucide-react";

interface KdsFooterProps {
  ordersToday: number;
  avgPrepTime: string;
  currentlyCooking: number;
  readyForPickup: number;
}

const stats = [
  {
    key: "ordersToday",
    label: "Orders Today",
    icon: ClipboardList,
    color: "text-status-new",
    bg: "bg-status-new/10",
  },
  {
    key: "avgPrepTime",
    label: "Avg Prep Time",
    icon: Timer,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  {
    key: "currentlyCooking",
    label: "Cooking Now",
    icon: Flame,
    color: "text-status-cooking",
    bg: "bg-status-cooking/10",
  },
  {
    key: "readyForPickup",
    label: "Ready for Pickup",
    icon: CheckCircle2,
    color: "text-status-ready",
    bg: "bg-status-ready/10",
  },
] as const;

export function KdsFooter({
  ordersToday,
  avgPrepTime,
  currentlyCooking,
  readyForPickup,
}: KdsFooterProps) {
  const values: Record<string, string | number> = {
    ordersToday,
    avgPrepTime,
    currentlyCooking,
    readyForPickup,
  };

  return (
    <footer
      className="border-t border-border px-6 py-3"
      style={{ backgroundColor: "var(--kds-header)" }}
    >
      <div className="flex items-center justify-center gap-8 flex-wrap">
        {stats.map(({ key, label, icon: Icon, color, bg }) => (
          <div key={key} className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div className={`text-xl font-black leading-none tabular-nums ${color}`}>
                {values[key]}
              </div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5 uppercase tracking-wide">
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
