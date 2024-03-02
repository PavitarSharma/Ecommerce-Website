/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { IImage, TMedia } from "../../../types";
import { axiosInstance } from "../../../config/api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { handleApiError } from "../../../utils/handleApiError";
import Button from "../../layout/buttons/Button";

interface UploadImageProps {}

export interface UploadImageRef {
  images: IImage[];
  setImages: React.Dispatch<React.SetStateAction<IImage[]>>;
  medias: TMedia[];
  setMedias: React.Dispatch<React.SetStateAction<TMedia[]>>;
  handleValidate: () => void;
  resetImages: () => void;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}
const UploadImages: React.ForwardRefRenderFunction<
  UploadImageRef,
  UploadImageProps
> = (_, ref) => {
  const [images, setImages] = useState<IImage[]>([]);
  const [medias, setMedias] = useState<TMedia[]>([]);
  const [validate, setValidate] = useState(false);
  const [color, setColor] = useState("");

  const uploadImages = async (files: File[]) => {
    const loadingToast = toast.loading("Uploading...");
    try {
      const formdata = new FormData();
      files.forEach((file) => formdata.append("file", file));
      const { data } = await axiosInstance.post(
        "/products/upload-media",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImages(data);
      toast.success("Uploaded successfully");
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }
      toast.error(message);
    } finally {
      toast.dismiss(loadingToast);
    }
  };
  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Do something with the acceptedFiles

      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error: any) => {
          console.error(`File ${file.name} was rejected: ${error.message}`);
          // Here you can show an error message to the user
          toast.error(`File ${file.name} was rejected: ${error.message}`);
        });
      });
      await uploadImages(acceptedFiles);
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleValidate = useCallback(() => {
    setValidate(false)
    if (medias.length === 0) {
      setValidate(true);
    }
  }, [medias.length]);

  const resetImages = () => {
    setImages([]);
    setMedias([])
  };

  useImperativeHandle(ref, () => ({
    images,
    setImages,
    handleValidate,
    resetImages,
    medias,
    setMedias,
    color,
    setColor,
  }));

  const onSubmit = () => {
    setValidate(false);
    if (images.length === 0) {
      setValidate(true);
      return;
    }

    const uploadMedias: TMedia = {
      medias: images,
      color,
    };

    setMedias([uploadMedias, ...medias]);
    setColor("")
    setImages([])
  };

  return (
    <div className="flex flex-col gap-2 mb-6">
      <div>
        <div className="flex items-center justify-center w-full">
          <label
            {...getRootProps()}
            htmlFor="image"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={`flex flex-col items-center justify-center w-full h-64 border ${
              validate && images.length === 0
                ? "border-red-400"
                : "border-gray-300"
            } border-dashed rounded-lg cursor-pointer bg-gray-50`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
            </div>
            <input
              multiple
              name="image"
              {...getInputProps()}
              id="image"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <div className="mt-4">
          <label htmlFor="color" className="text-xs font-medium text-gray-900">
            Color
          </label>
          <input
            type="text"
            value={color}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setColor(event.target.value)
            }
            id="color"
            autoComplete="off"
            className={`border border-gray-300 bg-gray-50 w-full p-2 rounded-md text-gray-900 text-sm font-normal focus:outline-0`}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button label="Save" onClick={onSubmit} />
        </div>
      </div>
      {medias.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {medias.map((media: TMedia, index) => (
            <div key={index} className="flex items-center flex-wrap gap-2">
              {media.medias.map((image: IImage, idx: number) => (
                <div key={idx} className="w-[50px] h-[50px] relative rounded-md ">
                    {
                        media.color && <div style={{ backgroundColor: media.color}} className="absolute inset-0 opacity-20 rounded-md"></div>
                    }
                  <img
                    src={image.url}
                    alt={`product-image-${image.id}`}
                    className="w-full h-full rounded-md object-contain shadow border"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default forwardRef(UploadImages);
