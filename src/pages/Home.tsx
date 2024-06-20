import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { useInView } from "react-intersection-observer";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
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
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    });

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetchingNextPage, fetchNextPage]);

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
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 0: 1, 600: 2, 900: 3, 1200: 4 }}
            >
              <Masonry gutter="20px">
                {data?.pages.map((page) =>
                  page.data.map((item) => (
                    <div
                      key={item.id}
                      className="break-inside-avoid bg-white shadow-md rounded-lg overflow-hidden hover:bg-gray-100 transition-all duration-150 cursor-pointer relative"
                      onClick={() => handlePostClick(item)}
                      style={{ marginBottom: "20px" }}
                    >
                      <div className="relative group">
                        <img
                          className="w-full h-auto"
                          src={item.imageUrl}
                          alt={item.caption}
                        />
                        <div className="absolute bottom-1 left-0 rounded-md px-2 py-1  group-hover:block  hidden">
                          <div className="flex items-center justify-center gap-2 rounded-full px-3 py-1 bg-gray-800/70">
                            {item?.user.imageUrl ? (
                              <img
                                src={`${import.meta.env.VITE_SERVER_URL}/${item?.user.imageUrl}`}
                                className="h-[40px] w-[40px] rounded-full"
                                alt="Profile"
                              />
                            ) : (
                              <div className="h-[40px] w-[40px] bg-gray-200 p-2 flex justify-center items-center rounded-full font-thin">
                                <FaRegUser />
                              </div>
                            )}
                            <p className="text-white font-bold">
                              {item.user.username}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="font-bold break-words">{item.caption}</p>
                        <p className="mt-2 text-gray-600 text-sm">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </Masonry>
            </ResponsiveMasonry>
          </div>
          <div ref={ref} className="text-center">
            {isFetchingNextPage && <Loader />}
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
