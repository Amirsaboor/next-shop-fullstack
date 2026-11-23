export type DashboardRecentOrder = {
  _id: string;
  orderNumber: string;
  total: number;
  status:
    | 'pending_payment'
    | 'paid'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  createdAt: string;
  user: {
    firstName?: string;
    lastName?: string;
  } | null;
};

export type DashboardStats = {
  products: {
    total: number;
    active: number;
    inactive: number;
  };
  categories: {
    total: number;
    active: number;
  };
  users: {
    total: number;
  };
  orders: {
    total: number;
    pendingPayment: number;
  };
  revenue: {
    paid: number;
    currency: 'TOMAN';
  };
  recentOrders: DashboardRecentOrder[];
};
