import type { Order } from "./kds-types";

const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000);

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-001",
    orderNumber: 1042,
    tableNumber: 5,
    createdAt: minutesAgo(3),
    status: "new",
    isPriority: false,
    items: [
      { id: "i1", name: "Salmon Sashimi", quantity: 2, station: "Sushi" },
      { id: "i2", name: "Tuna Roll", quantity: 1, station: "Sushi", specialNote: "NO WASABI" },
      { id: "i3", name: "Miso Soup", quantity: 2, station: "Drinks" },
    ],
  },
  {
    id: "ord-002",
    orderNumber: 1043,
    tableNumber: 12,
    createdAt: minutesAgo(8),
    status: "cooking",
    isPriority: true,
    items: [
      { id: "i4", name: "Ribeye Steak", quantity: 1, station: "Grill", specialNote: "MEDIUM RARE" },
      { id: "i5", name: "French Fries", quantity: 2, station: "Fryer" },
      { id: "i6", name: "Caesar Salad", quantity: 1, station: "Grill" },
      { id: "i7", name: "Sparkling Water", quantity: 2, station: "Drinks" },
    ],
  },
  {
    id: "ord-003",
    orderNumber: 1044,
    tableNumber: 3,
    createdAt: minutesAgo(14),
    status: "cooking",
    isPriority: false,
    items: [
      { id: "i8", name: "Dragon Roll", quantity: 1, station: "Sushi" },
      { id: "i9", name: "Spicy Tuna Hand Roll", quantity: 2, station: "Sushi" },
      { id: "i10", name: "Edamame", quantity: 1, station: "Grill" },
    ],
  },
  {
    id: "ord-004",
    orderNumber: 1045,
    tableNumber: 8,
    createdAt: minutesAgo(22),
    status: "delayed",
    isPriority: false,
    items: [
      { id: "i11", name: "Chicken Teriyaki", quantity: 1, station: "Grill", specialNote: "EXTRA SAUCE" },
      { id: "i12", name: "Tempura Shrimp", quantity: 3, station: "Fryer" },
      { id: "i13", name: "Green Tea", quantity: 2, station: "Drinks" },
    ],
  },
  {
    id: "ord-005",
    orderNumber: 1046,
    tableNumber: 2,
    createdAt: minutesAgo(6),
    status: "ready",
    isPriority: false,
    items: [
      { id: "i14", name: "California Roll", quantity: 2, station: "Sushi" },
      { id: "i15", name: "Onion Rings", quantity: 1, station: "Fryer" },
      { id: "i16", name: "Coca-Cola", quantity: 2, station: "Drinks" },
    ],
  },
  {
    id: "ord-006",
    orderNumber: 1047,
    tableNumber: 15,
    createdAt: minutesAgo(1),
    status: "new",
    isPriority: true,
    items: [
      { id: "i17", name: "Wagyu Beef Burger", quantity: 2, station: "Grill", specialNote: "ONE VEGGIE PATTY" },
      { id: "i18", name: "Truffle Fries", quantity: 2, station: "Fryer" },
      { id: "i19", name: "Fresh Lemonade", quantity: 2, station: "Drinks" },
    ],
  },
  {
    id: "ord-007",
    orderNumber: 1048,
    tableNumber: 7,
    createdAt: minutesAgo(11),
    status: "cooking",
    isPriority: false,
    items: [
      { id: "i20", name: "Ebi Tempura Roll", quantity: 1, station: "Sushi" },
      { id: "i21", name: "Gyoza", quantity: 6, station: "Grill" },
      { id: "i22", name: "Sake", quantity: 1, station: "Drinks" },
    ],
  },
  {
    id: "ord-008",
    orderNumber: 1041,
    tableNumber: 1,
    createdAt: minutesAgo(18),
    status: "ready",
    isPriority: false,
    items: [
      { id: "i23", name: "Tonkotsu Ramen", quantity: 2, station: "Grill" },
      { id: "i24", name: "Karaage Chicken", quantity: 1, station: "Fryer" },
    ],
  },
];

export const KITCHEN_STATS = {
  ordersToday: 48,
  avgPrepTime: "11m",
  currentlyCooking: 3,
  readyForPickup: 2,
};
