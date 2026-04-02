"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Station, ViewMode } from "@/lib/kds-types";
import { ChefHat, LayoutGrid, Columns3, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

interface KdsHeaderProps {
  activeOrders: number;
  delayedOrders: number;
  station: Station;
  onStationChange: (s: Station) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
}

const STATIONS: Station[] = ["All", "Sushi", "Grill", "Fryer", "Drinks"];

export function KdsHeader({
  activeOrders,
  delayedOrders,
  station,
  onStationChange,
  viewMode,
  onViewModeChange,
}: KdsHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formattedTime = time
    ? time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "--:--:-- --";

  const formattedDate = time
    ? time.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "--- --- --";

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b border-border sticky top-0 z-50"
      style={{ backgroundColor: "var(--kds-header)" }}
    >
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-status-new">
          <ChefHat className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <div className="text-xl font-black tracking-tight text-foreground leading-none">
            SAKURA KITCHEN
          </div>
          <div className="text-xs text-muted-foreground font-medium mt-0.5">
            Kitchen Display System
          </div>
        </div>
      </div>

      {/* Center: Stats */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-3xl font-black tabular-nums text-foreground leading-none">
            {formattedTime}
          </div>
          <div className="text-xs text-muted-foreground font-medium mt-1">
            {formattedDate}
          </div>
        </div>

        <div className="w-px h-10 bg-border" />

        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-black text-foreground leading-none tabular-nums">
              {activeOrders}
            </div>
            <div className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">
              Active
            </div>
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-black leading-none tabular-nums ${delayedOrders > 0 ? "text-status-delayed" : "text-foreground"}`}
            >
              {delayedOrders}
            </div>
            <div className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">
              Delayed
            </div>
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        {mounted && theme && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-kds-surface-raised transition-all"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        )}
        {/* View mode toggle */}
        <div className="flex items-center bg-secondary rounded-lg p-1 gap-1">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
              viewMode === "grid"
                ? "bg-kds-surface-raised text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Grid
          </button>
          <button
            onClick={() => onViewModeChange("workflow")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
              viewMode === "workflow"
                ? "bg-kds-surface-raised text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns3 className="w-4 h-4" />
            Workflow
          </button>
        </div>

        {/* Station selector */}
        <Select
          value={station}
          onValueChange={(v) => onStationChange(v as Station)}
        >
          <SelectTrigger className="w-36 bg-secondary border-border text-foreground font-semibold text-sm h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-kds-surface border-border">
            {STATIONS.map((s) => (
              <SelectItem
                key={s}
                value={s}
                className="text-foreground font-semibold hover:bg-secondary focus:bg-secondary"
              >
                {s === "All" ? "All Stations" : s + " Station"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
