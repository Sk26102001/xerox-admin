import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus, PaymentStatus } from '@/types';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, updatePaymentStatus } = useApp();
  const { toast } = useToast();

  const order = orders.find(o => o.id === id);
  if (!order) return <div className="text-center py-12 text-muted-foreground">Order not found</div>;

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/admin/orders')} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders</Button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Order {order.id}</h1>
        <Button variant="outline" onClick={() => toast({ title: 'Download started (mock)' })}><Download className="h-4 w-4 mr-2" /> Download File</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Info */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-foreground mb-4">Customer Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{order.userName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{order.userEmail}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{order.userPhone}</span></div>
            {order.address && <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span>{order.address}</span></div>}
          </div>
        </div>

        {/* File & Print */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-foreground mb-4">Print Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">File</span><span>{order.fileName} ({order.fileType})</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Pages</span><span>{order.totalPages}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Print Type</span><span>{order.printType === 'bw' ? 'B&W' : 'Color'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Copies</span><span>{order.copies}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Paper</span><span>{order.paperSize} - {order.paperType}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Side</span><span className="capitalize">{order.printSide}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Binding</span><span>{order.bindingType}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="capitalize">{order.deliveryType}</span></div>
          </div>
        </div>

        {/* Cost */}
        <div className="bg-navy rounded-xl p-6 shadow-sm text-secondary-foreground">
          <h2 className="font-semibold mb-4">Cost Breakdown</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-secondary-foreground/70">Per Page</span><span>₹{order.perPageCost.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-secondary-foreground/70">Printing</span><span>₹{order.printingCost.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-secondary-foreground/70">Binding</span><span>₹{order.bindingCost.toFixed(2)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-₹{order.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span className="text-secondary-foreground/70">GST (18%)</span><span>₹{order.gst.toFixed(2)}</span></div>
            <div className="border-t border-navy-light pt-2 mt-2 flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">₹{order.totalCost.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Status Updates */}
        <div className="bg-card rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-foreground mb-2">Update Status</h2>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Order Status</label>
            <Select value={order.status} onValueChange={(v) => { updateOrderStatus(order.id, v as OrderStatus); toast({ title: `Status updated to ${v}` }); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="received">Received</SelectItem><SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="printing">Printing</SelectItem><SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Payment Status</label>
            <Select value={order.paymentStatus} onValueChange={(v) => { updatePaymentStatus(order.id, v as PaymentStatus); toast({ title: `Payment status updated to ${v}` }); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem><SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem><SelectItem value="cod">COD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-2">
            <Badge variant="outline" className={order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>Payment: {order.paymentStatus}</Badge>
            {order.transactionId && <Badge variant="outline">TXN: {order.transactionId}</Badge>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
