import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useApp } from '@/context/AppContext';

const statusColor: Record<string, string> = {
  received: 'bg-blue-100 text-blue-700', processing: 'bg-yellow-100 text-yellow-700',
  printing: 'bg-purple-100 text-purple-700', ready: 'bg-green-100 text-green-700',
  completed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-700',
};

const paymentColor: Record<string, string> = {
  paid: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700', cod: 'bg-blue-100 text-blue-700',
};

const AdminOrders = () => {
  const { orders } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const filtered = orders.filter(o => {
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.userName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (paymentFilter !== 'all' && o.paymentStatus !== paymentFilter) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Orders Management</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by ID or name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="received">Received</SelectItem><SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="printing">Printing</SelectItem><SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Payment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment</SelectItem>
            <SelectItem value="paid">Paid</SelectItem><SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem><SelectItem value="cod">COD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Order ID</TableHead><TableHead>Customer</TableHead><TableHead>Pages</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Payment</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(order => (
              <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell><Link to={`/orders/${order.id}`} className="text-primary font-medium hover:underline">{order.id}</Link></TableCell>
                <TableCell>{order.userName}</TableCell>
                <TableCell>{order.totalPages}</TableCell>
                <TableCell>{order.printType === 'bw' ? 'B&W' : 'Color'}</TableCell>
                <TableCell className="font-semibold">₹{order.totalCost.toFixed(2)}</TableCell>
                <TableCell><Badge variant="outline" className={paymentColor[order.paymentStatus]}>{order.paymentStatus}</Badge></TableCell>
                <TableCell><Badge variant="outline" className={statusColor[order.status]}>{order.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-sm">{order.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
