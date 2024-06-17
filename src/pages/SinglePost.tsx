import Modal from "../components/Modal";

type SinglePostProps = {
  isOpen: boolean;
  onClose: () => void;
  post: any;
};

const SinglePost = ({ isOpen, onClose, post }: SinglePostProps) => {
  if (!isOpen || !post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[90vw] h-[85vh]">
        <div className="flex w-full  items-center gap-20">
          <img
            className="h-[80vh] w-1/2 object-contain rounded-lg ml-10 "
            src={post.imageUrl}
            alt={post.caption}
          />
          <div className="w-1/2  justify-between  h-[60vh] relative">
            <h2 className="text-2xl font-bold">{post.caption}</h2>
            <h3 className="text-md mt-2">Author: {post.user.username} </h3>
            <p className="text-gray-600 mt-10 text-md">{post.description}</p>
            <p className="text-gray-600 absolute bottom-0 left-1 text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SinglePost;
