import AuthLayout from "@/layouts/AuthLayout";
import RootLayout from "../layouts/RootLayout";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import SuspenseUi from "@/components/ui/SuspenseUi";
import ErrorBoundary from "@/components/ErrorBoundary";

const Routes = () => {
  const routes = [
    {
      path: "/",
      Component: RootLayout,
      ErrorBoundary: ErrorBoundary, // Catches errors for home, storage hubs, about, and contact sections
      hydrateFallbackElement: <SuspenseUi />,
      children: [
        {
          index: true,
          lazy: async () => {
            const { default: Component } = await import("../pages/home/Home");
            return { Component };
          },
        },
        {
          path: "storage",
          lazy: async () => {
            const { default: Component } =
              await import("../layouts/StorageLayout.tsx");
            return { Component };
          },
          children: [
            {
              index: true,
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/findstorage/Storage.tsx");
                return { Component };
              },
            },
            {
              path: "details",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/findstorage/StorageDetails.tsx");
                return { Component };
              },
            },
          ],
        },
        {
          path: "about",
          lazy: async () => {
            const { default: Component } =
              await import("../pages/about/About.tsx");
            return { Component };
          },
        },
        {
          path: "contact",
          lazy: async () => {
            const { default: Component } =
              await import("../pages/contact/Contact.tsx");
            return { Component };
          },
        },
      ],
    },

    // auth pages routes
    {
      path: "auth",
      Component: AuthLayout,
      ErrorBoundary: ErrorBoundary, // Catches errors during dynamic validation, registration, or login requests
      children: [
        {
          path: "login",
          Component: Login,
        },
        {
          path: "register",
          Component: SignUp,
        },
        //  Secondary flows (Lazy-loaded on demand to keep initial bundle tiny)
        {
          path: "forgot-password",
          lazy: async () => {
            const { default: Component } =
              await import("../pages/auth/ForgotPassword.tsx");
            return { Component };
          },
        },
        {
          path: "verify-forgotpassword-otp",
          lazy: async () => {
            const { default: Component } =
              await import("../pages/auth/VerifyForgotOtp.tsx");
            return { Component };
          },
        },
        {
          path: "reset-password",
          lazy: async () => {
            const { default: Component } =
              await import("../pages/auth/ResetPassword.tsx");
            return { Component };
          },
        },
        {
          path: "verify-account",
          lazy: async () => {
            const { default: Component } =
              await import("../pages/auth/VerifyAccount.tsx");
            return { Component };
          },
        },
      ],
    },
  ] satisfies RouteObject[];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default Routes;
