
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { ProductState, reset, setCategory, setColor, setSize, setType } from "../../redux/slices/productSlice"
import React, { useState } from "react"
import { Slider } from "@mui/material"

type TColor = {
    color: string;
    total: number;
  };
  
  type TSize = {
    size: string;
    total: number;
  };
  
  type TType = {
    name: string;
    total: number;
  };
  
  type TClothCategory = {
    category: string;
    total: number;
  };
  
  const sizes: TSize[] = [
    {
      size: "Small",
      total: 36,
    },
    {
      size: "Medium",
      total: 24,
    },
    {
      size: "Large",
      total: 36,
    },
    {
      size: "XL",
      total: 22,
    },
    {
      size: "XXL",
      total: 12,
    },
    {
      size: "3XL",
      total: 36,
    },
    {
      size: "4XL",
      total: 8,
    },
    {
      size: "5XL",
      total: 4,
    },
    {
      size: "6XL",
      total: 3,
    },
  ];
  
  const colors: TColor[] = [
    {
      color: "grey",
      total: 36,
    },
    {
      color: "red",
      total: 24,
    },
    {
      color: "black",
      total: 22,
    },
    {
      color: "orange",
      total: 12,
    },
    {
      color: "blue",
      total: 36,
    },
    {
      color: "green",
      total: 8,
    },
    {
      color: "yellow",
      total: 4,
    },
    {
      color: "pink",
      total: 3,
    },
  ];
  
  const types: TType[] = [
    {
      name: "Clothes",
      total: 36,
    },
    {
      name: "Hair",
      total: 30,
    },
  ];
  
  const categories: TClothCategory[] = [
    {
      category: "Mens",
      total: 36,
    },
    {
      category: "Womens",
      total: 32,
    },
    {
      category: "Boys",
      total: 22,
    },
    {
      category: "Girls",
      total: 42,
    },
  ];
  
  function valuetext(value: number) {
    return `${value}°C`;
  }
  
  const Filter = () => {
    const dispatch = useAppDispatch();
    const { category, size, color, type } = useAppSelector(ProductState);
    const [value, setValue] = useState<number[]>([20, 37]);
  
    const handleChange = (_event: Event, newValue: number | number[]) => {
      setValue(newValue as number[]);
    };
  
    return (
      <div className="w-full lg:h-auto h-[450px] overflow-y-auto bg-white">
        <div className="py-4 text-center w-full border-b  flex items-center justify-between px-4">
          <p className="font-semibold"> Filter By</p>
          <div
            onClick={() => {
              dispatch(reset());
            }}
            className="border border-gray-300 rounded-md cursor-pointer py-1 px-2"
          >
            <span className="text-sm">Clear All</span>
          </div>
        </div>
  
        <div className="py-4 px-4">
          <Title title="Size" />
          <div className="flex flex-col gap-2 mt-2">
            {sizes.map((val: TSize, index: number) => (
              <CheckboxFilter
                key={index}
                id={val.size}
                label={val.size}
                checked={val.size === size}
                onChange={() =>
                  dispatch(setSize(val.size))
                }
                total={val.total}
              />
            ))}
          </div>
        </div>
  
        <div className="py-4 px-4">
          <Title title="Color" />
          <div className="flex flex-col gap-2 mt-2">
            {colors.map((val: TColor, index: number) => (
              <ColorFilter
                key={index}
                id={val.color}
                label={val.color}
                checked={val.color === color}
                onChange={() => dispatch(setColor(val.color))}
                total={val.total}
              />
            ))}
          </div>
        </div>
  
        <div className="py-4 px-4">
          <Title title="Price" />
          <div className="flex flex-col gap-2 mt-2">
            <label></label>
            <Slider
              // getAriaLabel={() => "Temperature range"}
              value={value}
              onChange={handleChange}
              // valueLabelDisplay="auto"
              getAriaValueText={valuetext}
            />
          </div>
        </div>
  
        <div className="py-4 px-4">
          <Title title="Type" />
          <div className="flex flex-col gap-2 mt-2">
            {types.map((val: TType, index: number) => (
              <CheckboxFilter
                key={index}
                id={val.name}
                label={val.name}
                checked={val.name === type}
                onChange={() => dispatch(setType(val.name))}
                total={val.total}
              />
            ))}
          </div>
        </div>
  
        <div className="py-4 px-4">
          <Title title="Category" />
          <div className="flex flex-col gap-2 mt-2">
            {categories.map((val: TClothCategory, index: number) => (
              <CheckboxFilter
                key={index}
                id={val.category}
                label={val.category}
                checked={val.category === category}
                onChange={() => dispatch(setCategory(val.category))}
                total={val.total}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Filter;
  
  const Title = ({ title }: { title: string }) => {
    return <h4 className="font-medium">{title}</h4>;
  };
  
  const CheckboxFilter = ({
    id,
    label,
    checked,
    onChange,
    total,
  }: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    total: number;
  }) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input id={id} type="checkbox" checked={checked} onChange={onChange} />
          <label htmlFor={id} className="text-sm capitalize">
            {label}
          </label>
        </div>
  
        <p className="text-sm capitalize">({total})</p>
      </div>
    );
  };
  
  const ColorFilter = ({
    id,
    label,
    checked,
    onChange,
    total,
  }: {
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
    total: number;
  }) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <input id={id} type="checkbox" checked={checked} onChange={onChange} /> */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              checked ? "border border-gray-600" : "border-0"
            }`}
          >
            <div
              onClick={onChange}
              style={{ backgroundColor: label.toLowerCase() }}
              className="w-4 h-4 rounded-full cursor-pointer"
            ></div>
          </div>
          <label htmlFor={id} className="text-sm capitalize">
            {label}
          </label>
        </div>
  
        <p className="text-sm capitalize">({total})</p>
      </div>
    );
  };
  