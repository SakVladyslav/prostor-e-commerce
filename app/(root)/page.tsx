import { getLatestProducts } from '@/lib/actions/product.actions';

import ProductList from '@/components/shared/product/product-list';

const Homepage = async () => {
  const latestProducts = await getLatestProducts();

  return (
    <>
      <ProductList title="Featured Products" data={latestProducts} limit={4} />
    </>
  );
};

export default Homepage;
