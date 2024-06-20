import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { queryClient } from "../main";
import Modal from "./Modal";

type UpdateProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const updateProfileSchema = z
  .object({
    username: z.string().optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.oldPassword || data.newPassword) {
        return data.oldPassword && data.newPassword;
      }
      return true;
    },
    {
      message:
        "Both old password and new password are required to change the password",
      path: ["oldPassword", "newPassword"],
    }
  );

type FormData = z.infer<typeof updateProfileSchema>;

const EditProfileModal = ({ isOpen, onClose }: UpdateProfileModalProps) => {
  const token = Cookies.get("token");
  const decoded = JSON.parse(atob(token?.split(".")[1] || ""));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateProfileSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: FormData) => {
      const updateData: any = {};
      if (data.username) updateData.username = data.username;
      if (data.oldPassword && data.newPassword) {
        updateData.oldPassword = data.oldPassword;
        updateData.newPassword = data.newPassword;
      }

      const response = await fetch(
        `http://localhost:8000/api/users/${decoded.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Failed to update profile");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      toast.success("Profile updated successfully!");
      await queryClient.invalidateQueries("profile");
      reset();
      onClose();
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || "Failed to update profile");
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className=" lg:h-[65vh] h-[40vh]">
        <p className="text-3xl text-center font-bold mb-10 mt-5">
          Update Profile
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 md:px-4 px-2 w-[80%] mx-auto"
        >
          <div className="flex flex-col gap-4">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              {...register("username")}
              placeholder="Username"
              className="bg-gray-200 px-3 py-2 rounded-lg mb-2"
            />
            {errors.username && (
              <span className="text-red-800 -mt-4">
                {errors.username?.message}
              </span>
            )}

            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              {...register("oldPassword")}
              placeholder="Old Password"
              className="bg-gray-200 px-3 py-2 rounded-lg mb-2"
            />
            {errors.oldPassword && (
              <span className="text-red-800 -mt-4">
                {errors.oldPassword?.message}
              </span>
            )}

            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              {...register("newPassword")}
              placeholder="New Password"
              className="bg-gray-200 px-3 py-2 rounded-lg mb-2"
            />
            {errors.newPassword && (
              <span className="text-red-800 -mt-4">
                {errors.newPassword?.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={`mt-10 text-white bg-purple-950 transition-all duration-150 p-2 rounded-xl px-4 mx-auto ${
              isPending ? "cursor-not-allowed" : ""
            }`}
            disabled={isPending}
          >
            {isPending ? "Updating Profile..." : "Update Profile"}
          </button>
          {error && <p className="text-red-500">{error.message}</p>}
        </form>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
