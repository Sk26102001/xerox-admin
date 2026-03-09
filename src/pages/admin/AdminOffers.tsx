import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Offer } from '@/types';

const AdminOffers = () => {
  const { offers, setOffers } = useApp();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Offer>>({ title: '', description: '', discountType: 'percentage', discountValue: 10, appliesTo: 'all', startDate: '2026-03-01', endDate: '2026-03-31', active: true });

  const handleCreate = () => {
    const newOffer: Offer = {
      id: `o${Date.now()}`, title: form.title!, description: form.description!,
      discountType: form.discountType!, discountValue: form.discountValue!,
      appliesTo: form.appliesTo!, startDate: form.startDate!, endDate: form.endDate!, active: form.active!,
    };
    setOffers(prev => [...prev, newOffer]);
    toast({ title: 'Offer Created' });
    setOpen(false);
  };

  const handleDelete = (id: string) => { setOffers(prev => prev.filter(o => o.id !== id)); toast({ title: 'Offer Deleted' }); };
  const toggleActive = (id: string) => { setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o)); };

  const appliesToLabel: Record<string, string> = { all: 'All Orders', bw: 'B&W Only', color: 'Color Only', student: 'Students' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Offers Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-primary hover:bg-cyan-light text-primary-foreground"><Plus className="h-4 w-4 mr-2" /> Create Offer</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Offer</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Description</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Discount Type</Label>
                  <Select value={form.discountType} onValueChange={v => setForm({ ...form, discountType: v as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="percentage">%</SelectItem><SelectItem value="fixed">₹</SelectItem></SelectContent></Select>
                </div>
                <div><Label>Value</Label><Input type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })} /></div>
              </div>
              <div><Label>Applies To</Label>
                <Select value={form.appliesTo} onValueChange={v => setForm({ ...form, appliesTo: v as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Orders</SelectItem><SelectItem value="bw">B&W Only</SelectItem><SelectItem value="color">Color Only</SelectItem><SelectItem value="student">Students</SelectItem></SelectContent></Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                <div><Label>End Date</Label><Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
              </div>
              <Button onClick={handleCreate} className="w-full bg-primary hover:bg-cyan-light text-primary-foreground">Create Offer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map(offer => (
          <div key={offer.id} className={`bg-card rounded-xl p-5 shadow-sm border-l-4 ${offer.active ? 'border-l-primary' : 'border-l-muted'}`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-foreground">{offer.title}</h3>
              <div className="flex gap-1">
                <Switch checked={offer.active} onCheckedChange={() => toggleActive(offer.id)} />
                <Button variant="ghost" size="icon" onClick={() => handleDelete(offer.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Discount: {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}</p>
              <p>Applies to: {appliesToLabel[offer.appliesTo]}</p>
              <p>{offer.startDate} → {offer.endDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOffers;
