import { Metadata } from 'next';
import Link from 'next/link';

import { deleteUser, getAllUsers } from '@/lib/actions/user.actions';
import { formatId } from '@/lib/utils';

import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const metadata: Metadata = {
  title: 'Admin Users',
};

const AdminUsersPage = async (props: {
  searchParams: Promise<{
    page?: string;
    query: string;
  }>;
}) => {
  const { page = '1', query: searchText } = await props.searchParams;

  const { data: users, totalPages } = await getAllUsers({
    page: Number(page),
    query: searchText,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h2 className="h2-bold">Users</h2>
        {searchText && (
          <div>
            Filtered by <i>&quot;{searchText}&quot;</i>
            <Link href="/admin/users" className="ml-2 text-sm">
              <Button variant="outline" size="sm">
                Remove filter
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead className="w-25">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(({ id, name, email, role }) => (
            <TableRow key={id}>
              <TableCell>{formatId(id)}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{email}</TableCell>
              <TableCell>
                {role === 'admin' ? (
                  <Badge variant="default">Admin</Badge>
                ) : (
                  <Badge variant="secondary">User</Badge>
                )}
              </TableCell>
              <TableCell>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/users/${id}`}>Edit</Link>
                </Button>
                <DeleteDialog action={deleteUser} id={id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination page={Number(page)} totalPages={totalPages} />
      )}
    </div>
  );
};

export default AdminUsersPage;
