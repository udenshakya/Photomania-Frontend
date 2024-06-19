import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import Modal from "../components/Modal";
import { queryClient } from "../main";

type DeletePostProps = {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  closeSinglePostModal: () => void;
};

const DeletePost = ({
  isOpen,
  onClose,
  post,
  closeSinglePostModal,
}: DeletePostProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const token = Cookies.get("token");
      const decoded = JSON.parse(atob(token?.split(".")[1] || ""));
      console.log(decoded);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/post/${post.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["posts", "profile"]);
      toast.success("Post deleted successfully!");
      closeSinglePostModal();
      navigate(pathname === "/profile" ? "/profile" : "/");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete post");
    },
  });

  const handleDelete = () => {
    mutate();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[60vw] h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-5">
          Are you sure you want to delete this post?
        </h1>
        <div className="flex gap-4 ">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-xl"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded-xl"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeletePost;
