/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import UploadImage, { UploadImageRef } from "./UploadImages";
import { AddProductSchema } from "../../../schemas";
import Input from "../../layout/inputs/Input";
import ReactSelect from "../../layout/inputs/ReactSelect";
import Button from "../../layout/buttons/Button";
import {
  clothSizes,
  clothesCategory,
  hairCategories,
  hairSizes,
} from "./data";
import TextArea from "../../layout/inputs/TextArea";
import MultiSelect from "../../layout/inputs/MultiSelect";
import { addProduct } from "../../../services";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { handleApiError } from "../../../utils/handleApiError";

type Schema = z.infer<typeof AddProductSchema>;

const AddProductForm = () => {
  const [type, setType] = useState("Clothes");
  const uploadImageRef = useRef<UploadImageRef>(null);
 
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Schema>({
    resolver: zodResolver(AddProductSchema),
  });

  const toggleType = useCallback((val: string) => setType(val), []);
  const onSubmit = async (values: Schema) => {
    if (uploadImageRef.current?.handleValidate()) {
      return true;
    }
    const images = uploadImageRef.current?.medias;

    const productSize = values.sizes.map((val: any) => val.value);
    console.log(productSize);
    
    const responseData = {
      ...values,
      sizes: productSize,
      price: +values.price,
      category: values.category.value,
      discountPrice: +values.discountPrice,
      shippingPrice: +values.shippingPrice,
      images,
      name: type,
      stock: +values.stock
    };

    
    const loading = toast.loading("Loading...");
    try {
      await addProduct(responseData);
      toast.success(`Product added successfully`);
      reset();
      setValue("sizes", []);
      uploadImageRef.current?.resetImages();
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }
      toast.error(message);
    } finally {
      toast.dismiss(loading);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col gap-6 mb-10">
      <div className="w-full">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-center text-2xl font-semibold">Create Product</h1>

          <div>
            <Button label="Add Product" onClick={handleSubmit(onSubmit)} />
          </div>
        </div>

        <div className="flex items-center justify-start gap-4 border-b border-gray-300 pb-4 my-4">
          {["Clothes", "Hair"].map((val: string) => (
            <button
              key={val}
              onClick={() => toggleType(val)}
              className={`border border-gray-300 rounded-md px-4 py-2 text-sm ${
                type === val && "bg-primary text-white"
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
      {/* <Controller
          name="description"
          defaultValue=""
          control={control}
          rules={{ required: "Please enter the product description!" }}
          render={({ field }) => (
            <Editor
              label="Description"
              value={field.value}
              onChange={field.onChange}
              error={errors.description?.message}
            />
          )}
        /> */}

      <form className="w-full flex flex-col gap-8">
        <div className="grid sm:grid-cols-2 grid-cols-1  gap-6">
          <div className="flex flex-col gap-6">
            <div>
              <div className="shadow bg-white rounded-md p-4 w-full">
                <p className="text-lg font-semibold mb-3">Product Media</p>

                <UploadImage ref={uploadImageRef} />
              </div>
            </div>

            <div className="shadow bg-white rounded-md p-4 w-full sm:max-h-[380px]">
              <p className="text-lg font-semibold">Specifications</p>

              <div className="flex flex-col gap-4 mt-3">
                <Input register={register} id="quality" label="Quality" hasBg />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="shadow bg-white rounded-md p-4 w-full sm:max-h-[380px]">
              <p className="text-lg font-semibold">General Information</p>

              <div className="flex flex-col gap-4 mt-3">
                <Input
                  register={register}
                  id="title"
                  label="Product Title"
                  error={errors.title?.message}
                  hasBg
                />
                <TextArea
                  register={register}
                  id="description"
                  label="Description"
                  error={errors.description?.message}
                  hasBg
                  cols={10}
                />
              </div>
            </div>

            {/* Price */}
            <div className="shadow bg-white rounded-md p-4 w-full">
              <p className="text-lg font-semibold">Pricing</p>

              <div className="flex flex-col gap-4 mt-3">
                <div className="flex items-center gap-4 ">
                  <Controller
                    control={control}
                    name="currency"
                    defaultValue="₹"
                    render={({ field: { value, onChange } }) => (
                      <select
                        value={value}
                        onChange={onChange}
                        className="w-14 outline-0 border border-gray-300 bg-gray-50 h-9 mt-5 rounded-md"
                      >
                        <option value="₹">₹</option>
                        <option value="€">€</option>
                        <option value="$">$</option>
                      </select>
                    )}
                  />
                  <div className="flex-1">
                    <Input
                      register={register}
                      id="price"
                      label="Basic Price"
                      error={errors.price?.message}
                      hasBg
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                  <Input
                    register={register}
                    id="shippingPrice"
                    label="Shipping Price"
                    hasBg
                  />
                  <Input
                    register={register}
                    id="discountPrice"
                    label="Discount Price (in %)"
                    hasBg
                  />
                  {/* <Controller
                    control={control}
                    name="descountType"
                    defaultValue=""
                    render={({
                      field: { value, onChange },
                      formState: { errors },
                    }) => (
                      <ReactSelect
                        options={[
                          "Free Shipping",
                          "Buy One, Get One",
                          "Cashback",
                        ]}
                        value={value}
                        onChange={onChange}
                        label="Discount Type"
                        hasBg
                        error={errors.category?.message}
                      />
                    )}
                  /> */}
                </div>
              </div>
            </div>

            <div className="shadow bg-white rounded-md p-4 w-full">
              <p className="text-lg font-semibold">Category</p>

              <div className="flex flex-col gap-4 mt-3">
                <Controller
                  control={control}
                  name="category"
                  defaultValue={{ value: "", label: "" }}
                  render={({
                    field: { value, onChange },
                    formState: { errors },
                  }) => (
                    <ReactSelect
                      options={
                        type === "Hair" ? hairCategories : clothesCategory
                      }
                      value={value}
                      onChange={onChange}
                      label="Product Category"
                      hasBg
                      error={errors.category?.message}
                    />
                  )}
                />

                <Controller
                  name="sizes"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <MultiSelect
                      options={type === "Hair" ? hairSizes : clothSizes}
                      label={type === "Hair" ? "Size (in inch)" : "Size"}
                      value={value}
                      onChange={onChange}
                      error={errors.sizes?.message}
                      hasBg
                    />
                  )}
                />
              </div>
            </div>

            {/* Inventory */}

            <div className="shadow bg-white rounded-md p-4  w-full">
              <p className="text-lg font-semibold">Inventory</p>

              <div className="grid grid-cols-3 gap-4 items-center mt-3">
                <Input register={register} id="sku" label="SKU" hasBg />
                <Input register={register} id="barcode" label="Barcode" hasBg />
                <Input register={register} id="stock" label="Quantity" hasBg />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
