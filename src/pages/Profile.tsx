import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

const Profile = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
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
    <div className="">
      {
        <div className=" h-[50vh] w-full flex justify-center bg-blue-200">
          <div>
            <div className="bg-red-300 p-2 h-24 w-24 rounded-full flex mx-auto">
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
            <button className="bg-red-400 flex justify-center items-center w-[70%] rounded-full mt-5 mx-auto px-2 py-1">
              Add Image
            </button>
            <button className="bg-red-400 flex justify-center items-center w-[70%] rounded-full mt-5 mx-auto px-2 py-1">
              Edit Profile
            </button>
            <h1 className="mt-6">
              <span className="font-bold  text-lg"> Username:</span>{" "}
              {user?.username}
            </h1>
            <h1 className="">
              <span className="font-bold  text-lg"> Email:</span> {user?.email}
            </h1>
          </div>
        </div>
      }
    </div>
  );
};

export default Profile;
