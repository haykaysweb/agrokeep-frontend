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
} from "./ProtectedRoutes";

const Routes = () => {
  const routes = [
    // =========================================================
    // PUBLIC APPLICATION ROUTES
    // =========================================================
    {
      path: "/",
      Component: RootLayout,
      ErrorBoundary: ErrorBoundary,

      children: [
        // -------------------------------------------------------
        // HOME
        // -------------------------------------------------------
        {
          index: true,
          lazy: async () => {
            const { default: Component } = await import("../pages/home/Home");
            return { Component };
          },
        },

        // -------------------------------------------------------
        // STORAGE
        // -------------------------------------------------------
        {
          path: "storage",
          lazy: async () => {
            const { default: Component } =
              await import("../layouts/StorageLayout");
            return { Component };
          },

          children: [
            // /storage
            {
              index: true,
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/findstorage/Storage");
                return { Component };
              },
            },

            // /storage/all
            {
              path: "all",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/findstorage/SeeAllHub");
                return { Component };
              },
            },

            // /storage/details/:slug
            {
              path: "details/:slug",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/findstorage/StorageDetails");
                return { Component };
              },
            },

            // ---------------------------------------------------
            // AUTHENTICATED BOOKING ROUTES
            // ---------------------------------------------------
            {
              Component: PrivateRoute,

              children: [
                // /storage/booking
                {
                  path: "booking",
                  lazy: async () => {
                    const { default: Component } =
                      await import("../pages/findstorage/booking/BookingDetails");
                    return { Component };
                  },
                },

                // /storage/bookings
                {
                  path: "bookings",
                  lazy: async () => {
                    const { default: Component } =
                      await import("../pages/findstorage/booking/MyBookings");
                    return { Component };
                  },
                },

                // /storage/viewbooking/:bookingId
                {
                  path: "viewbooking/:bookingId",
                  lazy: async () => {
                    const { default: Component } =
                      await import("../pages/findstorage/booking/ViewBooking");
                    return { Component };
                  },
                },

                // -------------------------------------------------
                // PAYMENT FLOW
                // -------------------------------------------------
                // These routes require:
                // 1. User authentication
                // 2. A valid booking flow / bookingId
                {
                  Component: RequireBookingRoute,

                  children: [
                    // /storage/payment
                    {
                      path: "payment",
                      lazy: async () => {
                        const { default: Component } =
                          await import("../pages/findstorage/booking/Payment");
                        return { Component };
                      },
                    },

                    // /storage/confirmation
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

        // -------------------------------------------------------
        // PAYSTACK CALLBACK
        // -------------------------------------------------------
        //
        // Paystack redirects here after payment.
        //
        // IMPORTANT:
        // This must NOT be inside RequireBookingRoute because
        // Paystack needs to be able to redirect here directly.
        //
        // The Confirmation component then calls:
        // verifyPaymentApi(reference)
        //
        {
          path: "verify-payment",
          lazy: async () => {
            const { default: Component } =
              await import("../pages/findstorage/booking/Confirmation");

            return { Component };
          },
        },

        // -------------------------------------------------------
        // PROFILE
        // -------------------------------------------------------
        {
          path: "profile",
          lazy: async () => {
            const { default: Component } =
              await import("../layouts/ProfileLayout");
            return { Component };
          },
        },

        // -------------------------------------------------------
        // ABOUT
        // -------------------------------------------------------
        {
          path: "about",
          lazy: async () => {
            const { default: Component } = await import("../pages/about/About");
            return { Component };
          },
        },

        // -------------------------------------------------------
        // CONTACT
        // -------------------------------------------------------
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

    // =========================================================
    // AUTH ROUTES
    // =========================================================
    {
      path: "auth",
      Component: AuthLayout,
      ErrorBoundary: ErrorBoundary,

      children: [
        {
          Component: PublicRoute,

          children: [
            // /auth/login
            {
              path: "login",
              Component: Login,
            },

            // /auth/register
            {
              path: "register",
              Component: SignUp,
            },

            // /auth/forgot-password
            {
              path: "forgot-password",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/auth/ForgotPassword");
                return { Component };
              },
            },

            // /auth/verify-forgotpassword-otp
            {
              path: "verify-forgotpassword-otp",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/auth/VerifyForgotOtp");
                return { Component };
              },
            },

            // /auth/reset-password
            {
              path: "reset-password",
              lazy: async () => {
                const { default: Component } =
                  await import("../pages/auth/ResetPassword");
                return { Component };
              },
            },

            // /auth/verify-account
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
  ] satisfies RouteObject[];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default Routes;
