import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Modal from "../components/Modal";
import { queryClient } from "../main";

const DeletePost = ({ isOpen, onClose, post, closeSinglePostModal }) => {
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const token = Cookies.get("token");
      const decoded = JSON.parse(atob(token?.split(".")[1] || ""));
      console.log(decoded);

      const response = await fetch(
        `http://localhost:8000/api/post/${post.id}`,
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
      await queryClient.invalidateQueries("posts");
      toast.success("Post deleted successfully!");
      closeSinglePostModal();
      navigate("/");
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
      <div className="w-[70vw] h-[85vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-5">
          Are you sure you want to delete this post?
        </h1>
        <div className="flex gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeletePost;
