import { useState } from "react";
import Filter from "../../components/products/Filter";
import ListView from "../../components/products/ListView";
import Product from "../../components/products/Product";
import Topbar from "../../components/products/Topbar";
import useProducts from "../../hooks/queries/useProducts";
import { useAppSelector } from "../../redux/hooks";
import { ProductState } from "../../redux/slices/productSlice";
import { IProduct } from "../../types";

const Shop = () => {
  const [limit, setLimit] = useState(9)
  const [page, setPage] = useState(1)
  const { view,sort, type, size, category, color, price } = useAppSelector(ProductState);
  const params = {
    page,
    limit,
    category,
    color,
    price: Number(price),
    size,
    sort,
    type,
  }
  const { products, isLoading } = useProducts(params);
  
  return (
    <div className="flex gap-4 container my-10">
      <div className="w-[250px] lg:h-[1100px] border rounded-md lg:block hidden">
        <Filter  />
      </div>

      <div className="flex-1">
        <Topbar products={products} />
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-spin"></div>
          </div>
        ) : products && products.length > 0 ? (
          view === "grid" ? (
            <div className="grid  md:grid-cols-3 min-[476px]:grid-cols-2 grid-cols-1 gap-4">
              {products.map((product: IProduct) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {products.map((product: IProduct) => (
                <ListView key={product._id} product={product} />
              ))}
            </div>
          )
        ) : (
          "No Data Found"
        )}
      </div>
    </div>
  );
};

export default Shop;
