import React, { useState } from 'react'
import useProducts from '../../hooks/queries/useProducts';
import { IProduct } from '../../types';
import { Pagination, Rating } from '@mui/material';
import { FiEdit, FiEye } from 'react-icons/fi';
import { AiFillDelete } from 'react-icons/ai';
import NoData from '../../components/layout/NoData';
import Loading from '../../components/layout/Loading';
import Search from '../../components/admin/Search';

const Products = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  


  const { products, isLoading } = useProducts({ page, limit, query: search });

  if (!products) return;



  return (
    <div>
      <Search placeholder="Serach..." value={search} onChange={handleSearchChange} />
      <div className="relative overflow-x-auto rounded-lg mt-4">
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          products && products.length && (
            <>
              <table className="lg:w-full w-[900px] text-sm bg-white  shadow rounded-lg">
                <thead className="text-xs text-gray-700 uppercase whitespace-nowrap h-14 bg-white border-b">
                  <tr>
                    <th scope="col" className="px-6 py-3 ">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      PROUCT
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      CATEGORY
                    </th>
                    <th scope="col" className="px-6 py-3">
                      STOCK
                    </th>
                    <th scope="col" className="px-6 py-3">
                      RATING
                    </th>
                    <th scope="col" className="px-6 py-3">
                      LAST UPDATE
                    </th>

                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((row: IProduct, index: number) => (
                    <tr
                      key={index}
                      className="border border-r-0 border-t-0 border-l-0 border-b border-b-gray-200 hover:bg-gray-50 transition duration-300 cursor-pointer "
                    >
                      <td className="px-6 py-3 text-center">{index+1}</td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center  gap-2">
                          <img
                            src={row.images[0]?.medias[0].url}
                            alt={row.title}
                            className="w-9 h-9 rounded-full border object-cover"
                          />
                          <span className="font-medium line-clamp-1">
                            {row.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">{row.category}</td>
                      <td className="px-6 py-3 text-center">{row.stock}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Rating
                            name="half-rating"
                            defaultValue={row.rating.rate}
                            precision={0.5}
                          />

                          <span className="text-slate-500 text-sm text-center">
                            {row.rating.count}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-3">
                          <FiEye
                            size={18}
                            className="text-blue-600 cursor-pointer"
                          />
                          <FiEdit
                            size={18}
                            className="text-gray-600 cursor-pointer"
                          />
                          <AiFillDelete
                            size={18}
                            className="text-red-600 cursor-pointer"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )
        )}

        {products.length === 0 ? <NoData />: null}
      </div>

      {products?.length > 0 && (
        <div className="mb-6 mt-6 flex lg:items-center lg:justify-between lg:flex-row flex-col  gap-6">
          <div className="flex flex-row items-center gap-3">
            <p className="text-gray-400">Showing 1-10 out of 50</p>
            {/* <SelectList
              options={[10, 15, 20, 25, 30]}
              selected={limit}
              onChange={setLimit}
              width="80px"
            /> */}
            <select className='p-2 border-gray-300 border rounded-md'>
              {
                [10, 15, 20, 25].map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))
              }
            </select>
          </div>

          <Pagination
            showFirstButton
            showLastButton
            count={10}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </div>
      )}
    </div>
  );
};

export default Products