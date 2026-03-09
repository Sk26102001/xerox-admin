import { useApp } from '@/context/AppContext';
import { ShoppingCart, Clock, CheckCircle, XCircle, DollarSign, Users, FileText, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const weeklyData = [
  { day: 'Mon', revenue: 1200 }, { day: 'Tue', revenue: 1800 }, { day: 'Wed', revenue: 950 },
  { day: 'Thu', revenue: 2100 }, { day: 'Fri', revenue: 2800 }, { day: 'Sat', revenue: 3200 }, { day: 'Sun', revenue: 1600 },
];

const monthlyData = [
  { month: 'Oct', orders: 45 }, { month: 'Nov', orders: 62 }, { month: 'Dec', orders: 78 },
  { month: 'Jan', orders: 55 }, { month: 'Feb', orders: 90 }, { month: 'Mar', orders: 42 },
];

const AdminDashboard = () => {
  const { orders, users } = useApp();

  const stats = [
    { label: 'New Orders', value: orders.filter(o => o.status === 'received').length, icon: ShoppingCart, color: 'text-blue-500' },
    { label: 'Processing', value: orders.filter(o => o.status === 'processing' || o.status === 'printing').length, icon: Clock, color: 'text-yellow-500' },
    { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, icon: XCircle, color: 'text-red-500' },
    { label: 'Total Revenue', value: `₹${orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalCost, 0).toFixed(0)}`, icon: DollarSign, color: 'text-primary' },
    { label: "Today's Revenue", value: '₹2,885', icon: TrendingUp, color: 'text-primary' },
    { label: 'Total Users', value: users.filter(u => u.role === 'user').length, icon: Users, color: 'text-purple-500' },
    { label: 'Pages Printed', value: '12,450', icon: FileText, color: 'text-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
