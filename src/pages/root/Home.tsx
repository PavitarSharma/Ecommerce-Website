import Button from "../../components/layout/buttons/Button";
import Product from "../../components/products/Product";
import useProducts from "../../hooks/queries/useProducts";
import NoData from "../../components/layout/NoData";
import { IProduct } from "../../types";
import { useState } from "react";

const Home = () => {
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const { products, isLoading } = useProducts({ limit, page});


  return (
    <div className="container my-10 ">
      {isLoading
        ? "Loading..."
        : products &&
          products?.length > 0 ? (
            <>
              <div className="grid  xl:grid-cols-4 min-[868px]:grid-cols-3 min-[528px]:grid-cols-2 grid-cols-1 gap-4">
                {products.map((product: IProduct) => (
                  <div key={product._id} className="px-2">
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <div className="mt-10 flex items-center w-full justify-center">
                <Button label="Load More" onClick={() => {}} />
              </div>
            </>
          ): <div>
            <NoData />
            </div>}
    </div>
  );
};

export default Home;
