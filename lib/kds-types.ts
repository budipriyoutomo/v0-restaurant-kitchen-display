export type OrderStatus = "new" | "cooking" | "ready" | "delayed";
export type Station = "All" | "Sushi" | "Grill" | "Fryer" | "Drinks";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  station: Station;
  specialNote?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  tableNumber: number;
  createdAt: Date;
  status: OrderStatus;
  items: OrderItem[];
  isPriority: boolean;
}

export type ViewMode = "grid" | "workflow";
