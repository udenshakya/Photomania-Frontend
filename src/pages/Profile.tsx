import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaRegUser } from "react-icons/fa";
import EditProfileModal from "../components/EditProfileModal";
import MyPosts from "../components/MyPosts";

const Profile = () => {
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [modal, setModal] = useState("");
  const token = Cookies.get("token");
  const decoded = JSON.parse(atob(token?.split(".")[1] || ""));

  const {
    data,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/users/my`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      return data;
    },
  });

  // For uploading image
  const { mutate, isPending: uploadLoading } = useMutation({
    mutationFn: async (file) => {
      console.log(file);
      const formData = new FormData();
      formData.append("myFile", file);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/users/${decoded.id}/image`,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
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
          <div className="bg-gray-200 h-40 w-40 rounded-full flex mx-auto justify-center items-center">
            {user?.imageUrl ? (
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/${user?.imageUrl}`}
                className="h-[140px] w-[140px] rounded-full"
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
              className="bg-purple-900 text-white flex justify-center items-center rounded-full mt-8 mx-auto w-[65%] py-2 cursor-pointer"
            >
              {uploadLoading ? "Uploading..." : "Upload Image"}
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <button
            className="bg-purple-900 text-white flex justify-center items-center rounded-full mt-5 mx-auto px-5 py-2"
            onClick={() => setEditProfileModalOpen(true)}
          >
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
      <EditProfileModal
        isOpen={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
