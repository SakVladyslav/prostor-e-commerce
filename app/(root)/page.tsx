import {
  getFeaturedProducts,
  getLatestProducts,
} from '@/lib/actions/product.actions';

import ProductCarousel from '@/components/shared/product/product-carousel';
import ProductList from '@/components/shared/product/product-list';

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList title="Featured Products" data={latestProducts} limit={4} />
    </>
  );
};

export default Homepage;
