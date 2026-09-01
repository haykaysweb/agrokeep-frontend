import AuthLayout from "@/layouts/AuthLayout";
import RootLayout from "@/layouts/RootLayout";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router";

import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import ErrorBoundary from "@/components/ErrorBoundary";

import {
  PublicRoute,
  PrivateRoute,
  RequireBookingRoute,
  AdminRoute,
} from "./ProtectedRoutes";
import SuspenseUi from "@/components/ui/SuspenseUi";
import AdminLayout from "@/layouts/AdminLayout.tsx";

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
              await import("../layouts/StorageLayout");
            return { Component };
          },
          children: [
            {
              index: true,
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/findstorage/Storage");
                return { Component };
              },
            },
            {
              path: "all",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/findstorage/SeeAllHub");
                return { Component };
              },
            },
            {
              path: "details/:slug",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/findstorage/StorageDetails");
                return { Component };
              },
            },
            {
              Component: PrivateRoute,
              children: [
                {
                  path: "booking",
                  lazy: async () => {
                    const { default: Component } =
                      await import("../pages/findstorage/booking/BookingDetails");
                    return { Component };
                  },
                },
                {
                  path: "bookings",
                  lazy: async () => {
                    const { default: Component } =
                      await import("../pages/findstorage/booking/MyBookings");
                    return { Component };
                  },
                },
                {
                  path: "viewbooking/:bookingId",
                  lazy: async () => {
                    const { default: Component } =
                      await import("../pages/findstorage/booking/ViewBooking");
                    return { Component };
                  },
                },
                {
                  Component: RequireBookingRoute,
                  children: [
                    {
                      path: "payment",
                      lazy: async () => {
                        const { default: Component } =
                          await import("../pages/findstorage/booking/Payment");
                        return { Component };
                      },
                    },
                    {
                      path: "confirmation",
                      lazy: async () => {
                        const { default: Component } =
                          await import("../pages/findstorage/booking/Confirmation");
                        return { Component };
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: "verify-payment",
          lazy: async () => {
            const { default: Component } =
              await import("../pages/findstorage/booking/Confirmation");
            return { Component };
          },
        },
        {
          path: "profile",
          lazy: async () => {
            const { default: Component } =
              await import("../pages/profile/Profile");
            return { Component };
          },
        },
        {
          path: "about",
          lazy: async () => {
            const { default: Component } = await import("../pages/about/About");
            return { Component };
          },
        },
        {
          path: "contact",
          lazy: async () => {
            const { default: Component } =
              await import("../pages/contact/Contact");
            return { Component };
          },
        },
      ],
    },
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
                  await import("../pages/auth/ForgotPassword");
                return { Component };
              },
            },
            {
              path: "verify-forgotpassword-otp",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/auth/VerifyForgotOtp");
                return { Component };
              },
            },
            {
              path: "reset-password",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/auth/ResetPassword");
                return { Component };
              },
            },
            {
              path: "verify-account",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/auth/VerifyAccount");
                return { Component };
              },
            },
          ],
        },
      ],
    },
    {
      path: "admin",
      // Component: AdminRoute,
      ErrorBoundary: ErrorBoundary,
      hydrateFallbackElement: <SuspenseUi />,
      children: [
        {
          Component: AdminLayout,
          children: [
            {
              index: true,
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/admin/Dashboard");
                return { Component };
              },
            },
            {
              path: "bookings",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/admin/adminBookings/AdminBooking");

                return { Component };
              },
            },
            {
              path: "bookings/details",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/admin/adminBookings/AdminBookingDetails");

                return { Component };
              },
            },
            {
              path: "storage-hubs",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/admin/AdminStorageHub");
                return { Component };
              },
            },
            {
              path: "hub-applications",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/admin/HubApplications");
                return { Component };
              },
            },
            {
              path: "farmers",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/admin/AdminFarmers");
                return { Component };
              },
            },
            {
              path: "payments",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/admin/AdminPayments");
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
