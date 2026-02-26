import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';

import { getAllProducts } from '@/lib/actions/product.actions';
import { sortOrders } from '@/lib/constants/search-filters';

import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';

import SearchFilters from './search-filters';

type Props = {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await searchParams;

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet =
    category && category !== 'all' && category.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
        Search ${isQuerySet ? q : ''} 
        ${isCategorySet ? `: Category ${category}` : ''}
        ${isPriceSet ? `: Price ${price}` : ''}
        ${isRatingSet ? `: Rating ${rating}` : ''}
      `,
    };
  }

  return {
    title: 'Search Products',
  };
}

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

  const params = { q, sort, rating, price, page, category };

  // Construct filter url
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

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
      <SearchFilters
        category={params.category}
        price={params.price}
        rating={params.rating}
        cbFilter={getFilterUrl}
      />

      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col my-4 md:flex-row">
          <div className="flex items-center">
            {q !== 'all' && q !== '' && 'Query: ' + q}
            {category !== 'all' && category !== '' && ' Category: ' + category}
            {price !== 'all' && ' Price: ' + price}
            {rating !== 'all' && ' Rating: ' + rating + ' stars & up'}
            &nbsp;
            {(q !== 'all' && q !== '') ||
            (category !== 'all' && category !== '') ||
            rating !== 'all' ||
            price !== 'all' ? (
              <Button variant="link" asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Sort by{' '}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2 ${sort === s && 'font-bold'}`}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
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
