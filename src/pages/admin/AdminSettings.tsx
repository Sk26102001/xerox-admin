import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();
  const [adminName, setAdminName] = useState('Admin User');
  const [adminEmail, setAdminEmail] = useState('admin@printshop.com');
  const [shopName, setShopName] = useState('PrintShop');
  const [shopAddress, setShopAddress] = useState('123 Print Street, New Delhi');
  const [shopPhone, setShopPhone] = useState('+91 99999 99999');

  const handleSave = () => toast({ title: 'Settings Saved', description: 'Your settings have been updated' });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-foreground">Admin Profile</h2>
          <div><Label>Name</Label><Input value={adminName} onChange={e => setAdminName(e.target.value)} /></div>
          <div><Label>Email</Label><Input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} /></div>
          <div><Label>New Password</Label><Input type="password" placeholder="Leave empty to keep current" /></div>
          <Button onClick={handleSave} className="bg-primary hover:bg-cyan-light text-primary-foreground">Update Profile</Button>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-foreground">Shop Details</h2>
          <div><Label>Shop Name</Label><Input value={shopName} onChange={e => setShopName(e.target.value)} /></div>
          <div><Label>Address</Label><Input value={shopAddress} onChange={e => setShopAddress(e.target.value)} /></div>
          <div><Label>Phone</Label><Input value={shopPhone} onChange={e => setShopPhone(e.target.value)} /></div>
          <Button onClick={handleSave} className="bg-primary hover:bg-cyan-light text-primary-foreground">Update Shop</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
