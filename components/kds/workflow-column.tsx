"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@/lib/kds-types";
import { OrderCard } from "./order-card";
import { cn } from "@/lib/utils";

interface WorkflowColumnProps {
  title: string;
  status: OrderStatus;
  orders: Order[];
  onStatusChange: (id: string, status: OrderStatus) => void;
  onCancel: (id: string) => void;
  onDrop: (orderId: string, targetStatus: OrderStatus) => void;
  accentClass: string;
  countBgClass: string;
}

export function WorkflowColumn({
  title,
  status,
  orders,
  onStatusChange,
  onCancel,
  onDrop,
  accentClass,
  countBgClass,
}: WorkflowColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const id = e.dataTransfer.getData("orderId");
    if (id) onDrop(id, status);
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border transition-all min-h-0",
        isDragOver ? "border-foreground/40 bg-muted/30" : "border-border",
      )}
      style={{ backgroundColor: isDragOver ? undefined : "var(--kds-surface)" }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 border-b rounded-t-xl",
          accentClass,
        )}
      >
        <h2 className="text-base font-black uppercase tracking-widest text-foreground">
          {title}
        </h2>
        <span
          className={cn(
            "text-sm font-black px-2.5 py-0.5 rounded-full tabular-nums",
            countBgClass,
          )}
        >
          {orders.length}
        </span>
      </div>

      {/* Orders */}
      <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40 gap-2">
            <div className="text-4xl font-black">—</div>
            <div className="text-sm font-semibold uppercase tracking-wide">
              No {title.toLowerCase()} orders
            </div>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("orderId", order.id);
                setDraggingId(order.id);
              }}
              onDragEnd={() => setDraggingId(null)}
              className="cursor-grab active:cursor-grabbing"
            >
              <OrderCard
                order={order}
                onStatusChange={onStatusChange}
                onCancel={onCancel}
                isDragging={draggingId === order.id}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
