"use client";

import { useState, useEffect, useCallback } from "react";
import { KdsHeader } from "@/components/kds/kds-header";
import { KdsFooter } from "@/components/kds/kds-footer";
import { OrderCard } from "@/components/kds/order-card";
import { WorkflowColumn } from "@/components/kds/workflow-column";
import { INITIAL_ORDERS, KITCHEN_STATS } from "@/lib/kds-data";
import type { Order, OrderStatus, Station, ViewMode } from "@/lib/kds-types";

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [station, setStation] = useState<Station>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Auto-mark delayed orders (>20 mins)
  useEffect(() => {
    const id = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => {
          const elapsed = (Date.now() - o.createdAt.getTime()) / 1000 / 60;
          if (elapsed >= 20 && o.status !== "ready" && o.status !== "delayed") {
            return { ...o, status: "delayed" as OrderStatus };
          }
          return o;
        }),
      );
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const handleStatusChange = useCallback((id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );
  }, []);

  const handleCancel = useCallback((id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const handleDrop = useCallback((orderId: string, targetStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: targetStatus } : o)),
    );
  }, []);

  // Filter by station
  const filteredOrders =
    station === "All"
      ? orders
      : orders.filter((o) => o.items.some((i) => i.station === station));

  const activeOrders = orders.filter(
    (o) => o.status !== "ready",
  ).length;
  const delayedOrders = orders.filter((o) => o.status === "delayed").length;
  const readyOrders = orders.filter((o) => o.status === "ready").length;
  const cookingOrders = orders.filter((o) => o.status === "cooking").length;

  const newOrders = filteredOrders.filter((o) => o.status === "new");
  const cookingFiltered = filteredOrders.filter((o) => o.status === "cooking");
  const readyFiltered = filteredOrders.filter((o) => o.status === "ready");
  const delayedFiltered = filteredOrders.filter((o) => o.status === "delayed");

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <KdsHeader
        activeOrders={activeOrders}
        delayedOrders={delayedOrders}
        station={station}
        onStationChange={setStation}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main content */}
      <main className="flex-1 overflow-auto px-4 py-5 md:px-6">
        {viewMode === "grid" ? (
          <div className="columns-1 md:columns-2 xl:columns-3 gap-5 space-y-0">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center col-span-3">
                <div className="text-6xl font-black text-muted-foreground/20 mb-3">
                  NO ORDERS
                </div>
                <div className="text-muted-foreground font-medium">
                  {station !== "All"
                    ? `No active orders for the ${station} station`
                    : "All caught up! No active orders."}
                </div>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="break-inside-avoid mb-5">
                  <OrderCard
                    order={order}
                    onStatusChange={handleStatusChange}
                    onCancel={handleCancel}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          /* Workflow columns */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-[calc(100vh-160px)]">
            <WorkflowColumn
              title="NEW"
              status="new"
              orders={[...newOrders, ...delayedFiltered]}
              onStatusChange={handleStatusChange}
              onCancel={handleCancel}
              onDrop={handleDrop}
              accentClass="border-b border-status-new/30 bg-status-new/5"
              countBgClass="bg-status-new/20 text-status-new"
            />
            <WorkflowColumn
              title="COOKING"
              status="cooking"
              orders={cookingFiltered}
              onStatusChange={handleStatusChange}
              onCancel={handleCancel}
              onDrop={handleDrop}
              accentClass="border-b border-status-cooking/30 bg-status-cooking/5"
              countBgClass="bg-status-cooking/20 text-status-cooking"
            />
            <WorkflowColumn
              title="READY"
              status="ready"
              orders={readyFiltered}
              onStatusChange={handleStatusChange}
              onCancel={handleCancel}
              onDrop={handleDrop}
              accentClass="border-b border-status-ready/30 bg-status-ready/5"
              countBgClass="bg-status-ready/20 text-status-ready"
            />
          </div>
        )}
      </main>

      <KdsFooter
        ordersToday={KITCHEN_STATS.ordersToday + (INITIAL_ORDERS.length - orders.length)}
        avgPrepTime={KITCHEN_STATS.avgPrepTime}
        currentlyCooking={cookingOrders}
        readyForPickup={readyOrders}
      />
    </div>
  );
}
