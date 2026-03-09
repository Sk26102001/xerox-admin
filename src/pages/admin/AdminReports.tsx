import { useApp } from '@/context/AppContext';

const AdminReports = () => {
  const { orders, users } = useApp();

  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalCost, 0);
  const bwOrders = orders.filter(o => o.printType === 'bw').length;
  const colorOrders = orders.filter(o => o.printType === 'color').length;

  const topUsers = [...users]
    .filter(u => u.role === 'user')
    .sort((a, b) => b.totalSpending - a.totalSpending)
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Reports</h1>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl p-6 shadow-sm text-center">
          <p className="text-muted-foreground text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-primary">₹{totalRevenue.toFixed(0)}</p>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm text-center">
          <p className="text-muted-foreground text-sm mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-foreground">{orders.length}</p>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm text-center">
          <p className="text-muted-foreground text-sm mb-1">Avg Order Value</p>
          <p className="text-3xl font-bold text-foreground">₹{orders.length ? (totalRevenue / orders.length).toFixed(0) : 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Print Types */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-foreground mb-4">Most Ordered Print Types</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>B&W Prints</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-3 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${(bwOrders / orders.length) * 100}%` }} /></div>
                <span className="text-sm font-semibold">{bwOrders}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Color Prints</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-3 bg-muted rounded-full overflow-hidden"><div className="h-full bg-cyan-dark rounded-full" style={{ width: `${(colorOrders / orders.length) * 100}%` }} /></div>
                <span className="text-sm font-semibold">{colorOrders}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-foreground mb-4">Most Active Users</h2>
          <div className="space-y-3">
            {topUsers.map((user, i) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <div><p className="font-medium text-sm">{user.name}</p><p className="text-xs text-muted-foreground">{user.totalOrders} orders</p></div>
                </div>
                <span className="font-semibold text-primary">₹{user.totalSpending.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
