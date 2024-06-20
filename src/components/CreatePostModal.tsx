import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { queryClient } from "../main";
import Modal from "./Modal";

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const createPostSchema = z.object({
  caption: z
    .string()
    .min(1, { message: "Caption is required" })
    .max(40, { message: "Caption cannot be more than 40 characters" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(300, "Description cannot be more than 200 characters"),
  myFile: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: "Image is required" }),
});

type FormData = z.infer<typeof createPostSchema>;

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createPostSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      formData.append("caption", data.caption);
      formData.append("description", data.description);
      if (data.myFile[0]) {
        formData.append("myFile", data.myFile[0]);
      }

      const token = Cookies.get("token");

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/post`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log(data.message);
      queryClient.invalidateQueries({ queryKey: ["myposts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast.success("Post created successfully!");
      reset();
      setPreview(null);
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create post");
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[70vw] h-[85vh] ">
        <p className="text-3xl text-center font-bold lg:mb-10 mt-5">
          Create Post
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mt-10 lg:mt-0  md:px-11 px-10"
        >
          <div className="lg:flex lg:gap-20 ">
            <label
              htmlFor="myFile"
              className="lg:h-[50vh] lg:w-[500px]  cursor-pointer"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="lg:h-full h-[30vh] mx-auto object-cover rounded-lg cursor-pointer "
                />
              ) : (
                <div className="bg-gray-200 lg:w-full lg:h-full h-[30vh] flex justify-center items-center">
                  <p>Upload Image</p>
                  {/* <img
                    src="/Upload.png"
                    alt="upload"
                    className="w-full h-full object-contain"
                  /> */}
                </div>
              )}
            </label>
            <div className="flex flex-col gap-4 lg:w-[40%]  w-full lg:h-[57vh] h-[30vh]">
              <label htmlFor="caption" className="mt-10 lg:mt-0">
                Caption
              </label>
              <input
                type="text"
                {...register("caption")}
                placeholder="Caption"
                className="bg-gray-200 px-3 py-2 rounded-lg mb-2"
              />
              {errors.caption && (
                <span className="text-red-800 -mt-4">
                  {errors.caption.message}
                </span>
              )}

              <label htmlFor="description">Description</label>
              <textarea
                {...register("description")}
                placeholder="Description"
                rows={5}
                className="bg-gray-200 px-3 py-2 rounded-lg mb-2"
              />
              {errors.description && (
                <span className="text-red-800 -mt-4">
                  {errors.description.message}
                </span>
              )}

              <input
                type="file"
                id="myFile"
                accept="image/*"
                {...register("myFile")}
                className="opacity-0"
                onChange={handleFileChange}
              />
              {errors.myFile && (
                <span className="text-red-800 -mt-4">
                  {errors.myFile.message}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={`lg:mt-10 mt-0 text-white bg-purple-950 p-2 rounded-xl lg:w-[30%] w-full  mx-auto ${
              isPending ? "cursor-not-allowed" : ""
            }`}
            disabled={isPending}
          >
            {isPending ? "Creating Post..." : "Create Post"}
          </button>
          {error && <p className="text-red-500">{error.message}</p>}
        </form>
      </div>
    </Modal>
  );
};

export default CreatePostModal;
