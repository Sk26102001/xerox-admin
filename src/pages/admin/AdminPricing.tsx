import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

const AdminPricing = () => {
  const { pricing, setPricing } = useApp();
  const { toast } = useToast();
  const [form, setForm] = useState({ ...pricing });

  const preview = useMemo(() => {
    const pages = 100, copies = 1;
    const printingCost = pages * form.bwPrice * copies;
    const binding = form.bindingPrice;
    const subtotal = printingCost + binding;
    const gst = subtotal * 0.18;
    return { printingCost, binding, gst: Math.round(gst * 100) / 100, total: Math.round((subtotal + gst) * 100) / 100 };
  }, [form]);

  const handleSave = () => {
    setPricing(form);
    toast({ title: 'Pricing Updated', description: 'New pricing has been saved successfully' });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Pricing Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-foreground">Edit Prices</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>B&W Price (₹/page)</Label><Input type="number" step="0.1" value={form.bwPrice} onChange={e => setForm({ ...form, bwPrice: Number(e.target.value) })} /></div>
            <div><Label>Color Price (₹/page)</Label><Input type="number" step="0.1" value={form.colorPrice} onChange={e => setForm({ ...form, colorPrice: Number(e.target.value) })} /></div>
            <div><Label>Binding (₹)</Label><Input type="number" value={form.bindingPrice} onChange={e => setForm({ ...form, bindingPrice: Number(e.target.value) })} /></div>
            <div><Label>Lamination (₹)</Label><Input type="number" value={form.laminationPrice} onChange={e => setForm({ ...form, laminationPrice: Number(e.target.value) })} /></div>
            <div><Label>Double-sided Discount (%)</Label><Input type="number" value={form.doubleSidedDiscount} onChange={e => setForm({ ...form, doubleSidedDiscount: Number(e.target.value) })} /></div>
            <div><Label>Urgent Fee (₹)</Label><Input type="number" value={form.urgentFee} onChange={e => setForm({ ...form, urgentFee: Number(e.target.value) })} /></div>
          </div>
          <Button onClick={handleSave} className="bg-primary hover:bg-cyan-light text-primary-foreground">Save Pricing</Button>
        </div>

        <div className="bg-navy rounded-xl p-6 shadow-sm text-secondary-foreground">
          <h2 className="font-semibold mb-4">Preview (100 B&W pages, 1 copy, binding)</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-secondary-foreground/70">Printing Cost</span><span>₹{preview.printingCost.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-secondary-foreground/70">Binding</span><span>₹{preview.binding.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-secondary-foreground/70">GST (18%)</span><span>₹{preview.gst.toFixed(2)}</span></div>
            <div className="border-t border-navy-light pt-2 mt-2 flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">₹{preview.total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPricing;
