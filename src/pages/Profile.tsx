import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { FaRegUser } from "react-icons/fa";
import MyPosts from "../components/MyPosts";

const Profile = () => {
  const token = Cookies.get("token");
  const decoded = JSON.parse(atob(token?.split(".")[1] || ""));

  const {
    data,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/api/post/my", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      return data;
    },
  });

  const { mutate, isLoading: uploadLoading } = useMutation({
    mutationFn: async (file) => {
      console.log(file);
      const formData = new FormData();
      formData.append("myFile", file);
      const response = await fetch(
        `http://localhost:8000/api/users/${decoded.id}/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      return result;
    },
    onSuccess: () => {
      toast.success("Image uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload image");
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      mutate(file);
    }
  };

  if (profileLoading) return <div>Loading...</div>;
  if (profileError) return <div>Error loading profile data</div>;

  const user = data?.user;

  return (
    <div className="min-h-screen mt-6">
      <div className="h-[50vh] w-full flex justify-center">
        <div>
          <div className="bg-gray-200 h-32 w-32 rounded-full flex mx-auto justify-center items-center">
            {user?.imageUrl ? (
              <img
                src={`http://localhost:8000/${user?.imageUrl}`}
                className="h-24 w-24 rounded-full"
                alt="Profile"
              />
            ) : (
              <div className="text-4xl font-thin">
                <FaRegUser />
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="image"
              className="bg-purple-900 text-white flex justify-center items-center rounded-full mt-8 mx-auto px-5 w-1/2 py-2 cursor-pointer"
            >
              {uploadLoading ? "Uploading..." : "Add Image"}
            </label>
            <input
              type="file"
              id="image"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <button className="bg-purple-900 text-white flex justify-center items-center rounded-full mt-5 mx-auto px-5 py-2">
            Edit Profile
          </button>
          <h1 className="mt-6 text-lg mb-1">
            <span>Username:</span>
            <span className="font-bold"> {user?.username}</span>
          </h1>
          <h1 className="text-lg">
            <span>Email:</span>
            <span className="font-bold"> {user?.email}</span>
          </h1>
        </div>
      </div>
      <MyPosts />
    </div>
  );
};

export default Profile;
