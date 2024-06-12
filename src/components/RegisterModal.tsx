import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { z } from "zod";

type RegisterModalProps = {
  register: boolean;
  setRegister: React.Dispatch<React.SetStateAction<boolean>>;
};

const registerSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof registerSchema>;

const RegisterModal = ({ register, setRegister }: RegisterModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, error } = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed!");
      }

      return result;
    },
    onSuccess: (data) => {
      console.log("Registration successful:", data.message);
      setRegister(false);
      reset();
    },
    onError: (error: any) => {
      console.error("Registration failed:", error);
    },
  });

  const submitData: SubmitHandler<FormData> = (data) => {
    mutate(data);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setRegister(false);
      }
    };

    if (register) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [register, setRegister]);

  return (
    <div>
      {register && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
          <div
            ref={modalRef}
            className="bg-white p-4 rounded-2xl shadow-lg  flex flex-col relative py-10 pb-10 min-w-[40%] "
          >
            <p className="text-3xl text-center font-bold mb-10 mt-5">
              Register
            </p>
            <button
              className=" absolute top-2 right-2"
              onClick={() => setRegister(false)}
            >
              <div className="text-3xl ">
                <IoClose />
              </div>
            </button>
            <form
              onSubmit={handleSubmit(submitData)}
              className="flex flex-col gap-2 md:px-32 px-10 "
            >
              <label htmlFor="username">Username</label>
              <input
                type="text"
                {...formRegister("username")}
                placeholder="Username"
                className="bg-gray-200 px-3 py-2 rounded-lg mb-2"
              />
              {errors.username && (
                <span className="text-red-800">{errors.username.message}</span>
              )}

              <label htmlFor="email">Email</label>
              <input
                type="email"
                {...formRegister("email")}
                placeholder="Email"
                className="bg-gray-200 px-3 py-2 rounded-lg mb-2"
              />
              {errors.email && (
                <span className="text-red-800">{errors.email.message}</span>
              )}

              <label htmlFor="password">Password</label>
              <input
                type="password"
                {...formRegister("password")}
                placeholder="Password"
                className="bg-gray-200 px-3 py-2 rounded-lg mb-2"
              />
              {errors.password && (
                <span className="text-red-800">{errors.password.message}</span>
              )}
              <button
                type="submit"
                className="mt-10 text-white  bg-purple-950  transition-all duration-150 p-2 rounded-xl"
              >
                Register
              </button>
              <p className="text-red-500">{error?.message} </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterModal;
