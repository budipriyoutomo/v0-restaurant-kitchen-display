"use client";

import { useState, useEffect } from "react";
import { useOrderTimer } from "@/hooks/use-order-timer";
import type { Order, OrderStatus } from "@/lib/kds-types";
import { Clock, AlertTriangle, Flame, CheckCircle2, ChefHat, Truck, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onCancel: (id: string) => void;
  isDragging?: boolean;
}

const STATUS_BORDER: Record<OrderStatus, string> = {
  new: "border-status-new",
  cooking: "border-status-cooking",
  ready: "border-status-ready",
  delayed: "border-status-delayed",
};

const STATUS_BADGE_BG: Record<OrderStatus, string> = {
  new: "bg-status-new/20 text-status-new",
  cooking: "bg-status-cooking/20 text-status-cooking",
  ready: "bg-status-ready/20 text-status-ready",
  delayed: "bg-status-delayed/20 text-status-delayed",
};

const STATUS_GLOW: Record<OrderStatus, string> = {
  new: "shadow-[0_0_0_3px_oklch(0.55_0.2_240/0.35)]",
  cooking: "shadow-[0_0_0_3px_oklch(0.65_0.18_50/0.3)]",
  ready: "shadow-[0_0_0_3px_oklch(0.55_0.18_145/0.3)]",
  delayed: "shadow-[0_0_0_3px_oklch(0.55_0.22_25/0.35)]",
};

const STATION_COLORS: Record<string, string> = {
  Sushi: "bg-[oklch(0.4_0.12_240/0.7)] text-[oklch(0.8_0.15_240)]",
  Grill: "bg-[oklch(0.4_0.12_50/0.7)] text-[oklch(0.85_0.15_50)]",
  Fryer: "bg-[oklch(0.4_0.12_85/0.7)] text-[oklch(0.85_0.15_85)]",
  Drinks: "bg-[oklch(0.4_0.12_145/0.7)] text-[oklch(0.75_0.15_145)]",
};

export function OrderCard({ order, onStatusChange, onCancel, isDragging }: OrderCardProps) {
  const [mounted, setMounted] = useState(false);
  const { display, isWarning, isCritical } = useOrderTimer(order.createdAt);
  const isDelayed = order.status === "delayed" || isCritical;

  useEffect(() => {
    setMounted(true);
  }, []);

  const orderTime = mounted
    ? order.createdAt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "--:-- --";

  return (
    <div
      className={cn(
        "rounded-xl border-2 flex flex-col gap-0 animate-slide-in select-none",
        STATUS_BORDER[order.status],
        STATUS_GLOW[order.status],
        isDelayed && "animate-pulse-border",
        isDragging && "opacity-50 rotate-2 scale-105",
      )}
      style={{ backgroundColor: "var(--kds-surface)" }}
    >
      {/* Card Header */}
      <div
        className="px-4 pt-4 pb-3 rounded-t-[10px] border-b border-border"
        style={{ backgroundColor: "var(--kds-header)" }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-4xl font-black text-foreground leading-none tabular-nums">
                #{order.orderNumber}
              </span>
              {order.isPriority && (
                <span className="flex items-center gap-1 bg-status-delayed text-foreground text-xs font-black px-2 py-1 rounded-md uppercase tracking-wider">
                  <AlertTriangle className="w-3 h-3" />
                  PRIORITY
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-base font-bold text-muted-foreground">
                Table {order.tableNumber}
              </span>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-sm text-muted-foreground">{orderTime}</span>
            </div>
          </div>

          {/* Timer */}
          <div
            className={cn(
              "flex flex-col items-center px-3 py-2 rounded-lg min-w-[72px]",
              isCritical
                ? "bg-status-delayed/20"
                : isWarning
                  ? "bg-status-cooking/20"
                  : "bg-muted",
            )}
          >
            <Clock
              className={cn(
                "w-4 h-4 mb-0.5",
                isCritical
                  ? "text-status-delayed"
                  : isWarning
                    ? "text-status-cooking"
                    : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-xl font-black tabular-nums leading-none",
                isCritical
                  ? "text-status-delayed"
                  : isWarning
                    ? "text-status-cooking"
                    : "text-foreground",
              )}
            >
              {display}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <div className="mt-2">
          <span
            className={cn(
              "inline-flex items-center text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-md",
              STATUS_BADGE_BG[order.status],
            )}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Items list */}
      <div className="px-4 py-3 flex flex-col gap-2 flex-1">
        {order.items.map((item) => (
          <div key={item.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-black text-foreground leading-none tabular-nums w-8 shrink-0">
                  {item.quantity}x
                </span>
                <span className="text-base font-semibold text-foreground leading-tight">
                  {item.name}
                </span>
              </div>
              <span
                className={cn(
                  "text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0",
                  STATION_COLORS[item.station] ?? "bg-muted text-muted-foreground",
                )}
              >
                {item.station}
              </span>
            </div>
            {item.specialNote && (
              <div className="ml-10 flex items-center gap-1.5 bg-[oklch(0.65_0.18_85/0.15)] border border-[oklch(0.65_0.18_85/0.4)] rounded-md px-2.5 py-1">
                <AlertTriangle className="w-3 h-3 text-[oklch(0.75_0.18_85)] shrink-0" />
                <span className="text-xs font-black text-[oklch(0.85_0.15_85)] uppercase tracking-wide">
                  {item.specialNote}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 pt-2 grid grid-cols-2 gap-2 border-t border-border">
        {order.status === "new" && (
          <>
            <button
              onClick={() => onStatusChange(order.id, "cooking")}
              className="col-span-2 flex items-center justify-center gap-2 bg-status-cooking hover:bg-[oklch(0.72_0.2_50)] text-foreground font-black text-base px-4 py-3.5 rounded-lg transition-colors active:scale-95"
            >
              <Flame className="w-5 h-5" />
              Start Cooking
            </button>
            <button
              onClick={() => onCancel(order.id)}
              className="col-span-2 flex items-center justify-center gap-2 bg-secondary hover:bg-muted text-muted-foreground font-bold text-sm px-4 py-2.5 rounded-lg transition-colors active:scale-95"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </>
        )}
        {order.status === "cooking" && (
          <>
            <button
              onClick={() => onStatusChange(order.id, "ready")}
              className="col-span-2 flex items-center justify-center gap-2 bg-status-ready hover:bg-[oklch(0.62_0.2_145)] text-foreground font-black text-base px-4 py-3.5 rounded-lg transition-colors active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5" />
              Mark Ready
            </button>
            <button
              onClick={() => onCancel(order.id)}
              className="col-span-2 flex items-center justify-center gap-2 bg-secondary hover:bg-muted text-muted-foreground font-bold text-sm px-4 py-2.5 rounded-lg transition-colors active:scale-95"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </>
        )}
        {(order.status === "ready" || order.status === "delayed") && (
          <>
            {order.status === "delayed" && (
              <button
                onClick={() => onStatusChange(order.id, "cooking")}
                className="col-span-2 flex items-center justify-center gap-2 bg-status-cooking hover:bg-[oklch(0.72_0.2_50)] text-foreground font-black text-base px-4 py-3.5 rounded-lg transition-colors active:scale-95"
              >
                <Flame className="w-5 h-5" />
                Resume Cooking
              </button>
            )}
            {order.status === "ready" && (
              <button
                onClick={() => onCancel(order.id)}
                className="col-span-2 flex items-center justify-center gap-2 bg-status-new hover:bg-[oklch(0.62_0.22_240)] text-foreground font-black text-base px-4 py-3.5 rounded-lg transition-colors active:scale-95"
              >
                <Truck className="w-5 h-5" />
                Serve & Complete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
