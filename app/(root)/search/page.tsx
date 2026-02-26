import { getAllProducts } from '@/lib/actions/product.actions';

import ProductCard from '@/components/shared/product/product-card';

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = 'all',
    category = 'all',
    page = '1',
    price = 'all',
    rating = 'all',
    sort = 'newest',
  } = await props.searchParams;

  const { data, totalPages } = await getAllProducts({
    page: Number(page),
    query: q,
    category,
    price,
    rating,
    sort,
  });

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">{/* FILTERS */}</div>

      <div className="md:col-span-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.length === 0 && <div>No products found.</div>}
          {data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
