import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Loader from "../components/Loader";
import SinglePost from "./SinglePost";

const Home = () => {
  const { ref, inView } = useInView();
  const pageSize = 8;
  const [selectedPost, setSelectedPost] = useState(null);
  const [singlePostModalOpen, setSinglePostModalOpen] = useState(false);

  const fetchData = async ({ pageParam = 1 }) => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/post/all?page=${pageParam}&pageSize=${pageSize}`
    );
    const data = await response.json();
    return data;
  };

  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam }) => fetchData({ pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.page < lastPage.totalPages
          ? lastPage.page + 1
          : undefined;
      },
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setSinglePostModalOpen(true);
  };

  const handleCloseSinglePostModal = () => {
    setSelectedPost(null);
    setSinglePostModalOpen(false);
  };

  if (error) return <div>Error fetching posts</div>;

  return (
    <main>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h1 className="text-center text-3xl mt-4 font-semibold">Explore</h1>
          <h2 className="text-center text-lg mt-2">
            Share your thoughts and moments with the world
          </h2>
          <div className="p-5 md:p-10">
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 w-full mx-auto h-auto space-y-3 pb-28">
              {data?.pages.map((page) =>
                page.data.map((item) => (
                  <div
                    key={item.id}
                    className="break-inside-avoid bg-white shadow-md rounded-lg overflow-hidden hover:bg-gray-100 transition-all duration-150 cursor-pointer relative"
                    onClick={() => handlePostClick(item)}
                  >
                    <div className="relative  group ">
                      <img
                        className="w-full h-auto"
                        src={item.imageUrl}
                        alt={item.caption}
                      />
                      <div className="absolute bottom-1 left-1 rounded-md px-2 py-1 bg-purple-950  hidden group-hover:block ">
                        <p className="text-white ">
                          Author: {item.user.username}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-lg">{item.caption}</p>
                      <p className="mt-2 text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div ref={ref} className="text-center">
              {isFetchingNextPage && <Loader />}
            </div>
          </div>
        </>
      )}
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

export default Home;
