import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useApp } from '@/context/AppContext';

const AdminUsers = () => {
  const { users } = useApp();
  const customerUsers = users.filter(u => u.role === 'user');

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">User Management</h1>
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Orders</TableHead><TableHead>Spending</TableHead><TableHead>Joined</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {customerUsers.map(user => (
              <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell><Link to={`/users/${user.id}`} className="text-primary font-medium hover:underline">{user.name}</Link></TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.totalOrders}</TableCell>
                <TableCell className="font-semibold">₹{user.totalSpending.toFixed(0)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{user.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
