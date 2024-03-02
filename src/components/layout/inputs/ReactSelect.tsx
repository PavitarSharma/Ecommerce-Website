/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Select, { ActionMeta } from "react-select";

interface ReactSelectSelectProps<T extends React.ReactNode> {
  options: { label: string; value: T }[];
  value: { label: string; value: T } | null; 
  onChange: (
    newValue:{ label: string; value: T } | null,
    actionMeta: ActionMeta<{ label: string; value: T }>
  ) => void; 
  width?: string;
  label?: string;
  error?: string;
  hasBg?: boolean;
  placeholder?: string;
}
const ReactSelect = <T extends React.ReactNode>({
  label,
  options,
  placeholder,
  hasBg,
  value,
  onChange,
  error,
}: ReactSelectSelectProps<T>) => {
    const customStyles = {
        control: (provided: any) => ({
          ...provided,
          border: "1px solid #99999970",
          background: hasBg ? "#99999910" : "white",
          borderRadius: "6px",
          padding: "1px",
          outline: "none !important",
          boxShadow: "none",
          "&:focus": {
            outline: "none !important",
          }
        }),
        option: (provided: any) => ({
          ...provided,
          outline: "none !important",
        }),
        multiValue: (provided: any) => ({
          ...provided,
          outline: "none !important",
        }),
      };

  return (
    <div>
      {label && (
        <span className="text-xs font-medium text-gray-900">{label}</span>
      )}
      <Select
        styles={customStyles}
        options={options}
        className="basic-multi-select outline-0"
        classNamePrefix="select"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
       {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ReactSelect;
