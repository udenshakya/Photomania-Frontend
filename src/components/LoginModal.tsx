import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import Modal from "./Modal";

type LoginModalProps = {
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof loginSchema>;

const LoginModal = ({ login, setLogin }: LoginModalProps) => {
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
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed!");
      }

      return result;
    },
    onSuccess: (data) => {
      console.log("Login successful:", data.message);
      toast.success("Login successful!"); // Display a success toast
      localStorage.setItem("token", data.token);
      setLogin(false);
      reset();
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      toast.error("Login failed!"); // Display an error toast
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
        className="flex flex-col gap-2 md:px-32 px-10"
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
        {error && <p className="text-red-500">{(error as Error).message}</p>}
      </form>
    </Modal>
  );
};

export default LoginModal;
