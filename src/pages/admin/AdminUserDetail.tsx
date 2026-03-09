import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, orders } = useApp();
  const user = users.find(u => u.id === id);
  if (!user) return <div className="text-center py-12 text-muted-foreground">User not found</div>;

  const userOrders = orders.filter(o => o.userId === user.id);

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/users')} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
      <h1 className="text-2xl font-bold text-foreground mb-6">{user.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl p-4 shadow-sm"><p className="text-muted-foreground text-xs">Email</p><p className="font-medium">{user.email}</p></div>
        <div className="bg-card rounded-xl p-4 shadow-sm"><p className="text-muted-foreground text-xs">Phone</p><p className="font-medium">{user.phone}</p></div>
        <div className="bg-card rounded-xl p-4 shadow-sm"><p className="text-muted-foreground text-xs">Joined</p><p className="font-medium">{user.createdAt}</p></div>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-4">Order History ({userOrders.length})</h2>
      <div className="space-y-3">
        {userOrders.map(order => (
          <div key={order.id} className="bg-card rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="font-bold text-foreground">{order.id}</span>
              <Badge variant="outline" className="ml-2 capitalize">{order.status}</Badge>
              <p className="text-sm text-muted-foreground mt-1">{order.fileName} · {order.totalPages}p · {order.createdAt}</p>
            </div>
            <span className="font-bold text-primary">₹{order.totalCost.toFixed(2)}</span>
          </div>
        ))}
        {userOrders.length === 0 && <p className="text-muted-foreground">No orders found.</p>}
      </div>
    </div>
  );
};

export default AdminUserDetail;
