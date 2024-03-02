import { useEffect, useState } from "react";
import { LoginSchema } from "../../schemas";
import useBrowserInfo from "../../hooks/useBrowserInfo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { axiosInstance } from "../../config/api";
import { AxiosError } from "axios";
import { handleApiError } from "../../utils/handleApiError";
import { AiOutlineWarning } from "react-icons/ai";
import FormError from "../../components/layout/FormError";
import FormSuccess from "../../components/layout/FormSuccess";
import Input from "../../components/layout/inputs/Input";
import { LuKeyRound } from "react-icons/lu";
import { IoMailOutline } from "react-icons/io5";
import Button from "../../components/layout/buttons/Button";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "../../assets/animations/auth-animation.json";
import { sendVerificationMail } from "../../services";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { UserState, setCredentials } from "../../redux/slices/userSlice";
import { storeInLocalStorage } from "../../config/localstorage";

type Schema = z.infer<typeof LoginSchema>;

const Login = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuth, user } = useAppSelector(UserState);
  const browserName = useBrowserInfo();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Schema>({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    if (isAuth) {
      if (user?.roles.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [isAuth, navigate, user?.roles]);

  const onSubmit = async (values: Schema) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await axiosInstance.post("/customers/login", {
        ...values,
        device: browserName,
      });
      dispatch(setCredentials(data));
      storeInLocalStorage("firstlinks_access_token", data.access_token);
      toast.success("User has successfully logged");
      if (data.customer.roles.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    setError("");
    setSuccess("");
    const email = getValues("email");
    const loading = toast.loading("Sending...");
    try {
      const data = await sendVerificationMail(email);
      if (data) {
        setError("");
        setSuccess(data.message);
      }
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }
      setError(message);
      toast.error(message, { position: "top-center" });
    } finally {
      toast.dismiss(loading);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex min-h-screen relative items-center">
      <div className="lg:w-1/2 w-full">
        <Lottie options={defaultOptions} />
      </div>
      <div className="px-4 flex items-center justify-center h-full lg:w-1/2 w-full lg:static absolute">
        <form className="bg-white border border-gray-300 rounded-md p-4 flex flex-col gap-4 max-w-lg w-full mx-auto">
          <h1 className="text-2xl font-bold">Create Account</h1>
          {error === "User not verified" ? (
            <div className="p-3 bg-red-100 rounded text-sm text-red-600 flex gap-2">
              <AiOutlineWarning size={20} />
              <div className="flex flex-col items-start">
                <span>Email is already registered but not verified</span>
                <span
                  onClick={sendVerificationEmail}
                  className="underline cursor-pointer"
                >
                  send verification mail
                </span>
              </div>
            </div>
          ) : (
            <FormError message={error} />
          )}
          <FormSuccess message={success} />

          <Input
            type="email"
            id="email"
            register={register}
            label="Email Address"
            error={errors.email?.message}
            icon={IoMailOutline}
            placeholder="john.doe@email.com"
          />
          <Input
            type="password"
            id="password"
            register={register}
            label="Password"
            error={errors.password?.message}
            icon={LuKeyRound}
            placeholder="***************"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                id="acceptTerm"
                type="checkbox"
                {...register("rememberMe")}
                className="w-4 h-4"
              />
              <label htmlFor="acceptTerm" className="text-sm underline">
                Remember me
              </label>
            </div>
            <Link
              to={"/forgot-password"}
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            disabled={isLoading}
            loading={isLoading}
            label="Log In"
            onClick={handleSubmit(onSubmit)}
          />

          <div className="flex items-center gap-4 my-4">
            <div className="w-full h-[1px] bg-gray-200 rounded"></div>
            <span className="opacity-70 text-sm">or</span>
            <div className="w-full h-[1px] bg-gray-200 rounded"></div>
          </div>

          <p className="text-center text-sm text-gray-600">
            New to our site?
            <Link
              to={"/auth/register"}
              className="text-primary font-medium hover:underline ml-1"
            >
              Sign up now.
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
