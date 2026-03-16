import { useState } from 'react';
import { Star, Plus, Trash2, Edit2, Check, X, MessageSquareQuote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  active: boolean;
  createdAt: string;
}

const initialTestimonials: Testimonial[] = [
  { id: 't1', name: 'Rahul Sharma', role: 'Student', content: 'Amazing print quality and super fast delivery! Best printing service I have used so far.', rating: 5, active: true, createdAt: '2026-01-15' },
  { id: 't2', name: 'Priya Patel', role: 'Business Owner', content: 'We get all our brochures printed here. The color accuracy is outstanding and prices are very reasonable.', rating: 5, active: true, createdAt: '2026-02-01' },
  { id: 't3', name: 'Amit Kumar', role: 'Professor', content: 'Reliable service for bulk printing of course materials. The binding quality is excellent.', rating: 4, active: true, createdAt: '2026-02-10' },
  { id: 't4', name: 'Sneha Reddy', role: 'Designer', content: 'Perfect for portfolio prints. The paper options are great and staff is very helpful.', rating: 5, active: false, createdAt: '2026-02-20' },
];

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', role: '', content: '', rating: 5 });

  const resetForm = () => { setForm({ name: '', role: '', content: '', rating: 5 }); setEditingId(null); setShowForm(false); };

  const handleSubmit = () => {
    if (!form.name || !form.content) { toast.error('Name and content are required'); return; }
    if (editingId) {
      setTestimonials(prev => prev.map(t => t.id === editingId ? { ...t, ...form } : t));
      toast.success('Testimonial updated');
    } else {
      const newT: Testimonial = { id: `t${Date.now()}`, ...form, active: true, createdAt: new Date().toISOString().split('T')[0] };
      setTestimonials(prev => [newT, ...prev]);
      toast.success('Testimonial added');
    }
    resetForm();
  };

  const handleEdit = (t: Testimonial) => {
    setForm({ name: t.name, role: t.role, content: t.content, rating: t.rating });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    toast.success('Testimonial deleted');
  };

  const toggleActive = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-sm mb-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4">{editingId ? 'Edit' : 'Add'} Testimonial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input placeholder="Customer Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Role / Title" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          </div>
          <Textarea placeholder="Testimonial content..." value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="mb-4" rows={3} />
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-muted-foreground">Rating:</span>
            {[1, 2, 3, 4, 5].map(r => (
              <button key={r} onClick={() => setForm(f => ({ ...f, rating: r }))}>
                <Star className={`h-5 w-5 ${r <= form.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="gap-2"><Check className="h-4 w-4" /> {editingId ? 'Update' : 'Save'}</Button>
            <Button variant="outline" onClick={resetForm} className="gap-2"><X className="h-4 w-4" /> Cancel</Button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl p-4 shadow-sm text-center">
          <p className="text-xs text-muted-foreground mb-1">Total</p>
          <p className="text-2xl font-bold text-foreground">{testimonials.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm text-center">
          <p className="text-xs text-muted-foreground mb-1">Active</p>
          <p className="text-2xl font-bold text-green-500">{testimonials.filter(t => t.active).length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm text-center">
          <p className="text-xs text-muted-foreground mb-1">Avg Rating</p>
          <p className="text-2xl font-bold text-yellow-500">{(testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm text-center">
          <p className="text-xs text-muted-foreground mb-1">5-Star</p>
          <p className="text-2xl font-bold text-primary">{testimonials.filter(t => t.rating === 5).length}</p>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {testimonials.map(t => (
          <div key={t.id} className="bg-card rounded-xl p-5 shadow-sm border border-border flex flex-col md:flex-row md:items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquareQuote className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-foreground">{t.name}</span>
                {t.role && <span className="text-xs text-muted-foreground">• {t.role}</span>}
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map(r => (
                  <Star key={r} className={`h-3.5 w-3.5 ${r <= t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{t.content}</p>
              <p className="text-xs text-muted-foreground mt-2">Added: {t.createdAt}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t.active ? 'Active' : 'Hidden'}</span>
                <Switch checked={t.active} onCheckedChange={() => toggleActive(t.id)} />
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}><Edit2 className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;
