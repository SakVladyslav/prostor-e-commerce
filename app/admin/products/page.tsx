import { Metadata } from 'next';
import Link from 'next/link';

import { deleteProduct, getAllProducts } from '@/lib/actions/product.actions';
import { formatCurrency, formatId } from '@/lib/utils';

import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from '@/components/shared/pagination';
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
  title: 'Admin Products',
};

const AdminProductsPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) => {
  const { category, query, page } = await props.searchParams;

  const pageNum = Number(page) || 1;
  const searchText = query || '';
  const categoryFilter = category || '';

  const { data: products, totalPages } = await getAllProducts({
    query: searchText,
    page: pageNum,
    category: categoryFilter,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
        <Button asChild variant="default">
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className="w-25">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(({ id, name, price, category, stock, rating }) => (
            <TableRow key={id}>
              <TableCell>{formatId(id)}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(price)}
              </TableCell>
              <TableCell>{category}</TableCell>
              <TableCell>{stock}</TableCell>
              <TableCell>{rating}</TableCell>
              <TableCell className="flex gap-1">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/products/${id}`}>Edit</Link>
                </Button>
                <DeleteDialog action={deleteProduct} id={id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && <Pagination page={pageNum} totalPages={totalPages} />}
    </div>
  );
};

export default AdminProductsPage;
