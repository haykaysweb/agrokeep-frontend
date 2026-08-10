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
import {
  PublicRoute,
  PrivateRoute,
  RequireBookingRoute,
} from "./ProtectedRoutes.tsx";

const Routes = () => {
  const routes = [
    {
      path: "/",
      Component: RootLayout,
      ErrorBoundary: ErrorBoundary,
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
              path: "details/:slug",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/findstorage/StorageDetails.tsx");
                return { Component };
              },
            },

            // Protected Routes (Requires User Authentication)
            {
              Component: PrivateRoute,
              children: [
                {
                  path: "booking",
                  lazy: async () => {
                    const { default: Component } =
                      await import("../pages/findstorage/booking/BookingDetails.tsx");
                    return { Component };
                  },
                },
                {
                  path: "viewbooking/:bookingId",
                  lazy: async () => {
                    const { default: Component } =
                      await import("../pages/findstorage/booking/ViewBooking.tsx");
                    return { Component };
                  },
                },
                {
                  path: "bookings",
                  lazy: async () => {
                    const { default: Component } =
                      await import("../pages/findstorage/booking/MyBookings.tsx");
                    return { Component };
                  },
                },

                // Strict Flow Guard (Requires Authentication AND valid bookingId)
                {
                  Component: RequireBookingRoute,
                  children: [
                    {
                      path: "payment",
                      lazy: async () => {
                        const { default: Component } =
                          await import("../pages/findstorage/booking/Payment.tsx");
                        return { Component };
                      },
                    },
                    {
                      path: "confirmation",
                      lazy: async () => {
                        const { default: Component } =
                          await import("../pages/findstorage/booking/Confirmation.tsx");
                        return { Component };
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Paystack Callback Route (Placed at root level to match Paystack's redirect)
        {
          path: "verify-payment",
          lazy: async () => {
            const { default: Component } =
              await import("../pages/findstorage/booking/Confirmation.tsx");
            return { Component };
          },
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

    // Auth Pages Routes (Protected by PublicRoute - Redirects logged-in users away)
    {
      path: "auth",
      Component: AuthLayout,
      ErrorBoundary: ErrorBoundary,
      children: [
        {
          Component: PublicRoute,
          children: [
            {
              path: "login",
              Component: Login,
            },
            {
              path: "register",
              Component: SignUp,
            },
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
      ],
    },
  ] satisfies RouteObject[];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default Routes;
