import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import Modal from "../components/Modal";
import { queryClient } from "../main";

const updatePostSchema = z.object({
  caption: z.string().min(1, { message: "Caption is required" }).optional(),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .optional(),
  myFile: z
    .optional(z.instanceof(FileList))
    .refine((files) => !files || files.length > 0, {
      message: "Image is required",
    }),
});

type FormData = z.infer<typeof updatePostSchema>;

type UpdatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  closeSinglePostModal: () => void;
  post: {
    id: number;
    caption: string;
    description: string;
    imageUrl: string;
  } | null; // Ensure post can be null initially
};

const UpdatePost = ({
  isOpen,
  onClose,
  post,
  closeSinglePostModal,
}: UpdatePostModalProps) => {
  const [preview, setPreview] = useState<string | null>(post?.imageUrl || null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      caption: post?.caption || "",
      description: post?.description || "",
      imageUrl: post?.imageUrl || "",
    },
  });

  useEffect(() => {
    if (post) {
      reset({
        caption: post.caption,
        description: post.description,
        imageUrl: post.imageUrl,
      });
      setPreview(post.imageUrl);
    }
  }, [post, reset]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      if (data.caption) formData.append("caption", data.caption);
      if (data.description) formData.append("description", data.description);
      if (data.myFile) {
        formData.append("myFile", data.myFile[0]);
      }

      const token = Cookies.get("token");

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/post/${post?.id}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      toast.success("Post updated successfully!");
      await queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      closeSinglePostModal();
      onClose();
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
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

  if (!post) {
    return null; // Handle case where post is null (optional)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[70vw] h-[85vh]">
        <p className="text-3xl text-center font-bold mb-10 mt-5">Update Post</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-7 md:px-11 px-10"
        >
          <div className="flex gap-20">
            <label
              htmlFor="myFile"
              className="h-[50vh] w-[500px] cursor-pointer"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full object-cover rounded-lg cursor-pointer"
                />
              ) : (
                <div className="bg-gray-200 w-full h-full flex justify-center items-center">
                  <p>Upload Image</p>
                </div>
              )}
            </label>
            <div className="flex flex-col gap-4 w-[40%] h-[57vh]">
              <label htmlFor="caption">Caption</label>
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
                {...register("myFile")}
                className=""
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
            className={`mt-10 text-white bg-purple-950 transition-all duration-150 p-2 rounded-xl w-[30%] mx-auto ${
              isPending ? "cursor-not-allowed" : ""
            }`}
            disabled={isPending}
          >
            {isPending ? "Updating Post..." : "Update Post"}
          </button>
          {error && <p className="text-red-500">{(error as Error).message}</p>}
        </form>
      </div>
    </Modal>
  );
};

export default UpdatePost;
