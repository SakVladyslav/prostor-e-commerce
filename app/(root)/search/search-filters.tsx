import Link from 'next/link';

import { getAllProductCategories } from '@/lib/actions/product.actions';
import { prices, ratings } from '@/lib/constants/search-filters';

type SearchFiltersProps = {
  category?: string;
  price?: string;
  rating?: string;
  cbFilter: (c: any) => string;
};

const SearchFilters = async (props: SearchFiltersProps) => {
  let { category, price, rating, cbFilter } = props;

  const categories = await getAllProductCategories();

  return (
    <div className="filter-links">
      <div className="text-xl mb-2 mt-3">Department</div>
      <div>
        <ul className="space-y-1">
          <li>
            <Link
              className={`${(category === 'all' || category === '') && 'font-bold'}`}
              href={cbFilter({ c: 'all' })}
            >
              Any
            </Link>
          </li>
          {categories.map((x) => (
            <li key={x.category}>
              <Link
                className={`${category === x.category && 'font-bold'}`}
                href={cbFilter({ c: x.category })}
              >
                {x.category}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-xl mb-2 mt-8">Price</div>
      <div>
        <ul className="space-y-1">
          <li>
            <Link
              className={`${(price === 'all' || price === '') && 'font-bold'}`}
              href={cbFilter({ p: 'all' })}
            >
              Any
            </Link>
          </li>
          {prices.map((x) => (
            <li key={x.value}>
              <Link
                className={`${price === x.value && 'font-bold'}`}
                href={cbFilter({ p: x.value })}
              >
                {x.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-xl mb-2 mt-8">Customer Ratings</div>
      <div>
        <ul className="space-y-1">
          <li>
            <Link
              className={`${(rating === 'all' || rating === '') && 'font-bold'}`}
              href={cbFilter({ r: 'all' })}
            >
              Any
            </Link>
          </li>
          {ratings.map((rate) => (
            <li key={rate}>
              <Link
                className={`${rating === rate.toString() && 'font-bold'}`}
                href={cbFilter({ r: rate.toString() })}
              >
                {`${rate} stars & up`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchFilters;
