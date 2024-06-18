import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import MyPosts from "../components/MyPosts";

const Profile = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = Cookies.get("token");

      const response = await fetch("http://localhost:8000/api/post/my", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    },
  });

  const user = data?.user;
  return (
    <div className=" min-h-screen  flex flex-col ">
      <div className=" h-[50vh] w-full flex justify-center ">
        <div>
          <div className="bg-gray-200 p-2 h-24 w-24 rounded-full flex mx-auto">
            {user?.imageUrl ? (
              <img
                src={`http://localhost:8000/${user?.imageUrl}`}
                className="h-full w-full rounded-full "
                alt=""
              />
            ) : (
              <div>no imaghe</div>
            )}
          </div>
          <button className="bg-purple-900 text-white flex justify-center items-center  rounded-full mt-5 mx-auto px-4 py-2">
            Add Image
          </button>
          <button className="bg-purple-900 text-white flex justify-center items-center  rounded-full mt-5 mx-auto px-4 py-2">
            Edit Profile
          </button>
          <h1 className="mt-6 text-xl mb-1">
            <span className="font-bold "> Username:</span> {user?.username}
          </h1>
          <h1 className=" text-xl">
            <span className="font-bold  "> Email:</span> {user?.email}
          </h1>
        </div>
      </div>
      <MyPosts />
    </div>
  );
};

export default Profile;
