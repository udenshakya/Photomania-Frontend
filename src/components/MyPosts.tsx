import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useState } from "react";
import SinglePost from "../pages/SinglePost";
import Loader from "./Loader";

const MyPosts = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [singlePostModalOpen, setSinglePostModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["myposts"],
    queryFn: async () => {
      const token = Cookies.get("token");
      const decoded = JSON.parse(atob(token?.split(".")[1] || ""));
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/users/${decoded.id}/posts`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      return data;
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching posts</div>;

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setSinglePostModalOpen(true);
  };

  const handleCloseSinglePostModal = () => {
    setSelectedPost(null);
    setSinglePostModalOpen(false);
  };

  return (
    <main className=" ">
      <h1 className="text-center text-3xl mt-10  font-semibold">My Posts</h1>
      <h2 className="text-center text-lg mt-2">Your personal collection</h2>
      <div className="p-5 md:p-10">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 w-full mx-auto h-auto space-y-3 pb-28">
          {data?.posts?.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid bg-white shadow-md rounded-lg overflow-hidden hover:bg-gray-100 transition-all duration-150 cursor-pointer relative"
              onClick={() => handlePostClick(item)}
            >
              <div className="relative group">
                <img
                  className="w-full h-auto"
                  src={item.imageUrl}
                  alt={item.caption}
                />
                <div className="absolute bottom-1 left-1 rounded-md px-2 py-1 bg-purple-950 hidden group-hover:block">
                  <p className="text-white">Author: {item.user.username}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="font-bold text-lg break-words">{item.caption}</p>
                <p className="mt-2 text-gray-600">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedPost && (
        <SinglePost
          isOpen={singlePostModalOpen}
          onClose={handleCloseSinglePostModal}
          post={selectedPost}
        />
      )}
    </main>
  );
};

export default MyPosts;
