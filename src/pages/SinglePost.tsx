import Cookies from "js-cookie";
import { useState } from "react";
import Modal from "../components/Modal";
import DeletePost from "./DeletePost";
import UpdatePost from "./UpdatePost";

type SinglePostProps = {
  isOpen: boolean;
  onClose: () => void;
  post: any;
};

const SinglePost = ({ isOpen, onClose, post }: SinglePostProps) => {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const token = Cookies.get("token");
  let decoded;

  if (token) {
    decoded = JSON.parse(atob(token.split(".")[1]));
  }

  const handleOpenUpdateModal = () => {
    setUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  if (!isOpen || !post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[90vw] h-[85vh]">
        <div className="flex w-full items-center gap-20">
          <img
            className="h-[80vh] w-1/2 object-contain rounded-lg ml-10"
            src={post.imageUrl}
            alt={post.caption}
          />
          <div className="w-1/2 justify-between h-[60vh] relative">
            <h2 className="text-2xl font-bold">{post.caption}</h2>
            {decoded && decoded.id === post.user.id && (
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-purple-900 text-white px-4 py-2 rounded-xl"
                  onClick={handleOpenUpdateModal}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                  onClick={handleOpenDeleteModal}
                >
                  Delete
                </button>
              </div>
            )}
            <h3 className="text-md mt-2">Author: {post.user.username}</h3>
            <p className="text-gray-600 mt-10 text-md">{post.description}</p>
            <p className="text-gray-600 absolute bottom-0 left-1 text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <UpdatePost
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          post={post}
        />
        <DeletePost
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          post={post}
          closeSinglePostModal={onClose}
        />
      </div>
    </Modal>
  );
};

export default SinglePost;
