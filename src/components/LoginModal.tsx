import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import Modal from "./Modal";

type LoginModalProps = {
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setRegister: React.Dispatch<React.SetStateAction<boolean>>;
};

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof loginSchema>;

const LoginModal = ({ login, setLogin, setRegister }: LoginModalProps) => {
  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, error } = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed!");
      }

      return result;
    },
    onSuccess: (data) => {
      toast.success("Login successful!");
      Cookies.set("token", data.token);
      setLogin(false);
      reset();
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      toast.error("Login failed!");
    },
  });

  const submitData: SubmitHandler<FormData> = (data) => {
    mutate(data);
  };

  return (
    <Modal isOpen={login} onClose={() => setLogin(false)}>
      <p className="text-3xl text-center font-bold mb-10 mt-5">Login</p>
      <form
        onSubmit={handleSubmit(submitData)}
        className="flex flex-col gap-2 md:px-14 px-10"
      >
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
          className="mt-10 text-white bg-purple-950 transition-all duration-150 p-2 rounded-xl"
        >
          Login
        </button>
        {error && <p className="text-red-500">{error.message}</p>}
      </form>
      <p className="text-center mt-4">
        Don't have an account?{" "}
        <span
          className="text-purple-700 cursor-pointer"
          onClick={() => {
            setLogin(false);
            setRegister(true);
          }}
        >
          Register
        </span>
      </p>
    </Modal>
  );
};

export default LoginModal;
