import Cookies from "js-cookie";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa6";
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
        <div className="lg:flex  w-[80vw] items-center lg:gap-20">
          <img
            className="lg:h-[80vh] h-[40vh] lg:w-1/2 w-full mt-10 lg:mt-0 object-contain rounded-lg ml-10"
            src={post.imageUrl}
            alt={post.caption}
          />
          <div className="lg:w-1/2 w-full mx-auto lg:h-[60vh] px-3 ml-7 ">
            <h2 className="text-2xl font-bold text-start break-words md:w-full mt-10 lg:mt-0  ">
              {post.caption}
            </h2>
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
            <div className="flex gap-2 mt-3 mb-2">
              {post?.user.imageUrl ? (
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}/${post?.user.imageUrl}`}
                  className="h-[40px] w-[40px] rounded-full"
                  alt="Profile"
                />
              ) : (
                <div className="h-[40px] w-[40px] bg-gray-200 p-2 flex justify-center items-center rounded-full font-thin">
                  <FaRegUser />
                </div>
              )}{" "}
              <h3 className="text-md mt-2">{post.user.username}</h3>
            </div>
            <p className="text-gray-600  text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mt-2  lg:mt-10 break-words text-md ">
              <p> Description:</p>
              <p mt-2>{post.description}</p>
            </p>
          </div>
        </div>
        <UpdatePost
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          post={post}
          closeSinglePostModal={onClose}
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
