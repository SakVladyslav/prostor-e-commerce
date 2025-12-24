import sampleData from '@/sample-data';

import ProductList from '@/components/shared/product/product-list';

const Homepage = () => {
  return (
    <>
      <ProductList
        title="Featured Products"
        data={sampleData.products}
        limit={4}
      />
    </>
  );
};

export default Homepage;
