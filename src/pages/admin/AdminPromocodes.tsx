import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import axiosInstance from "@/api/axios.js";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Promocode } from '@/types';

const AdminPromocodes = () => {
  const { promocodes, setPromocodes } = useApp();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Promocode>>({ code: '', discountType: 'percentage', discountValue: 10, minOrder: 0, expiryDate: '2026-12-31', usageLimit: 100, active: true });

  const handleCreate = () => {
    const newCode: Promocode = {
      id: `p${Date.now()}`, code: form.code!.toUpperCase(), discountType: form.discountType!,
      discountValue: form.discountValue!, minOrder: form.minOrder!, expiryDate: form.expiryDate!,
      usageLimit: form.usageLimit!, usedCount: 0, active: form.active!,
    };
    setPromocodes(prev => [...prev, newCode]);
    toast({ title: 'Promocode Created' });
    setOpen(false);
    setForm({ code: '', discountType: 'percentage', discountValue: 10, minOrder: 0, expiryDate: '2026-12-31', usageLimit: 100, active: true });
  };

  const handleDelete = (id: string) => {
    setPromocodes(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Promocode Deleted' });
  };

  const toggleActive = (id: string) => {
    setPromocodes(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Promocode Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-primary hover:bg-cyan-light text-primary-foreground"><Plus className="h-4 w-4 mr-2" /> Create Code</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Promocode</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Code</Label><Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="SAVE10" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Type</Label>
                  <Select value={form.discountType} onValueChange={v => setForm({ ...form, discountType: v as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="percentage">Percentage (%)</SelectItem><SelectItem value="fixed">Fixed (₹)</SelectItem></SelectContent></Select>
                </div>
                <div><Label>Value</Label><Input type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Min Order (₹)</Label><Input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: Number(e.target.value) })} /></div>
                <div><Label>Usage Limit</Label><Input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: Number(e.target.value) })} /></div>
              </div>
              <div><Label>Expiry Date</Label><Input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} /></div>
              <Button onClick={handleCreate} className="w-full bg-primary hover:bg-cyan-light text-primary-foreground">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Discount</TableHead><TableHead>Min Order</TableHead><TableHead>Used</TableHead><TableHead>Expiry</TableHead><TableHead>Active</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {promocodes.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-mono font-bold">{p.code}</TableCell>
                <TableCell>{p.discountType === 'percentage' ? `${p.discountValue}%` : `₹${p.discountValue}`}</TableCell>
                <TableCell>₹{p.minOrder}</TableCell>
                <TableCell>{p.usedCount}/{p.usageLimit}</TableCell>
                <TableCell className="text-sm">{p.expiryDate}</TableCell>
                <TableCell><Switch checked={p.active} onCheckedChange={() => toggleActive(p.id)} /></TableCell>
                <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPromocodes;
