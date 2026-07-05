import AuthLayout from "@/layouts/AuthLayout";
import RootLayout from "../layouts/RootLayout";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyAccount from "@/pages/auth/VerifyAccount";
import VerifyForgotOtp from "@/pages/auth/VerifyForgotOtp";

const Routes = () => {
  const routes = [
    {
      path: "/",
      Component: RootLayout,
      children: [
        {
          index: true,
          lazy: async () => {
            const { default: Component } = await import("../pages/home/Home");
            return { Component };
          },
        },
      ],
    },
     {
      path: "auth",
      Component: AuthLayout,
   
    
      children: [
        {
          path: "login",
          element: (
           
              <Login />
           
          ),
        },
        {
          path: "register",
          element: (
           
              <SignUp />
          
          ),
        },
        {
          path: "forgot-password",
          Component: ForgotPassword,
        },
        {
        path: "verify-forgotpassword-otp",
          Component: VerifyForgotOtp,
        },
        {
          path: "reset-password",
          Component: ResetPassword,
        },
        {
          path: "verify-account",
          Component: VerifyAccount,
        },
      ],
    },
  ] satisfies RouteObject[];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default Routes;