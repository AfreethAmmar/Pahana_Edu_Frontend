export const API_BASE_URL = "/Pahana_Edu_Billing_war_exploded";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REGISTER: "/api/auth/register",
    PROFILE: "/api/auth/profile",
  },
  PRODUCTS: {
    BASE: "/api/products",
    BOOKS: "/api/products/books",
    STATIONARY: "/api/products/stationary",
    SEARCH: "/api/products/search",
    LOW_STOCK: "/api/products/low-stock",
  },
  USERS: {
    BASE: "/api/users",
    CUSTOMERS: "/api/users/customers",
    CASHIERS: "/api/users/cashiers",
  },
  DASHBOARD: {
    STATS: "/api/dashboard/stats",
    CHARTS: "/api/dashboard/charts",
    RECENT_ACTIVITY: "/api/dashboard/recent-activity",
  },
  SALES: {
    BASE: "/api/sales",
    CREATE: "/api/sales",
    BY_STATUS: "/api/sales/status",
    BY_CUSTOMER: "/api/sales/customer",
    ANALYTICS: "/api/sales/analytics",
    UPDATE_STATUS: "/api/sales/{id}/status",
  },
};

export const USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  CUSTOMER: "CUSTOMER",
  CASHIER: "CASHIER",
};

export const BOOK_GENRES = {
  STORY: "STORY",
  NOVEL: "NOVEL",
  ACTION: "ACTION",
  EDUCATIONAL: "EDUCATIONAL",
  COMICS: "COMICS",
  BIOGRAPHY: "BIOGRAPHY",
};

export const STATIONARY_TYPES = {
  PENS: "PENS",
  PENCILS: "PENCILS",
  NOTEBOOKS: "NOTEBOOKS",
  ERASERS: "ERASERS",
  RULERS: "RULERS",
  FILES: "FILES",
};

export const PRODUCT_TYPES = {
  BOOK: "BOOK",
  STATIONARY: "STATIONARY",
};

export const SALE_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
};

export const PAYMENT_METHODS = {
  CASH: "CASH",
  CARD: "CARD",
  DIGITAL: "DIGITAL",
};

export const STOCK_STATUS = {
  IN_STOCK: "IN_STOCK",
  LOW_STOCK: "LOW_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
};

export const LOW_STOCK_THRESHOLD = 5;

export const SORT_OPTIONS = [
  { value: "name", label: "Name A-Z" },
  { value: "-name", label: "Name Z-A" },
  { value: "price", label: "Price Low-High" },
  { value: "-price", label: "Price High-Low" },
  { value: "quantity", label: "Stock Low-High" },
  { value: "-quantity", label: "Stock High-Low" },
  { value: "-createdAt", label: "Newest First" },
  { value: "createdAt", label: "Oldest First" },
];

export const VIEW_MODES = {
  GRID: "GRID",
  LIST: "LIST",
};

export const TOAST_DURATION = 4000;

export const NAVIGATION_ITEMS = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
    roles: ["ADMIN", "USER", "CASHIER"],
  },
  {
    name: "Products",
    path: "/products",
    icon: "products",
    roles: ["ADMIN", "USER", "CASHIER"],
  },
  {
    name: "Books",
    path: "/books",
    icon: "book",
    roles: ["ADMIN", "USER", "CASHIER"],
  },
  {
    name: "Stationary",
    path: "/stationary",
    icon: "stationary",
    roles: ["ADMIN", "USER", "CASHIER"],
  },
  {
    name: "Customers",
    path: "/customers",
    icon: "users",
    roles: ["ADMIN", "CASHIER"],
  },
  {
    name: "Cashiers",
    path: "/cashiers",
    icon: "cashiers",
    roles: ["ADMIN"],
  },
  {
    name: "Sales",
    path: "/sales",
    icon: "sales",
    roles: ["ADMIN", "USER", "CASHIER"],
  },
  {
    name: "New Sale",
    path: "/sales/create",
    icon: "add_sale",
    roles: ["ADMIN", "USER", "CASHIER"],
  },
];

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export const FORM_VALIDATION = {
  REQUIRED: "This field is required",
  EMAIL: "Please enter a valid email address",
  MIN_PASSWORD: "Password must be at least 6 characters",
  MIN_PRICE: "Price must be greater than 0",
  MIN_QUANTITY: "Quantity must be at least 0",
  MAX_LENGTH: (max) => `Maximum ${max} characters allowed`,
};
