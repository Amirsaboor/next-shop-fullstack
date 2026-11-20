import 'server-only';

import Category from '@/modules/categories/models/category.model';
import Order from '@/modules/orders/models/order.model';
import Product from '@/modules/products/models/product.model';
import User from '@/modules/users/models/user.model';

export async function getAdminDashboardStats() {
  const [
    totalProducts,
    activeProducts,
    inactiveProducts,
    totalCategories,
    activeCategories,
    totalUsers,
    totalOrders,
    pendingOrders,
    paidRevenue,
    recentOrders,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: false }),
    Category.countDocuments(),
    Category.countDocuments({ isActive: true }),
    User.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending_payment' }),
    Order.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber total status createdAt user')
      .populate('user', 'firstName lastName')
      .lean(),
  ]);

  return {
    products: { total: totalProducts, active: activeProducts, inactive: inactiveProducts },
    categories: { total: totalCategories, active: activeCategories },
    users: { total: totalUsers },
    orders: { total: totalOrders, pendingPayment: pendingOrders },
    revenue: { paid: paidRevenue[0]?.total ?? 0, currency: 'TOMAN' },
    recentOrders,
  };
}
