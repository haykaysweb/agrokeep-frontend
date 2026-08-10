import { useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { bookingStorage } from "@/lib/bookingHelpers";

/**
 * PublicRoute
 * Redirects authenticated users away from Auth pages (Login/Register) back to home
 * or the page they came from.
 */
export function PublicRoute() {
  const { user, isAuthenticating } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!isAuthenticating && user) {
      navigate(from, { replace: true });
    }
  }, [user, isAuthenticating, from, navigate]);

  if (isAuthenticating) return null;

  return <Outlet />;
}

/**
 * PrivateRoute
 * Restricts access to authenticated users only.
 * Captures the current location so users can be redirected back after login.
 */
export function PrivateRoute() {
  const { user, isAuthenticating } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticating && !user) {
      navigate("/auth/login", {
        state: { from: location },
        replace: true,
      });
    }
  }, [user, isAuthenticating, location, navigate]);

  if (isAuthenticating) return null;

  return <Outlet />;
}

/**
 * AdminRoute
 * Restricts access to users with the admin role.
 */
export function AdminRoute() {
  const { user, isAuthenticating } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticating) {
      if (!user) {
        navigate("/auth/login", {
          state: { from: location },
          replace: true,
        });
      } else if (user.role !== "admin") {
        navigate("/", { replace: true });
      }
    }
  }, [user, isAuthenticating, location, navigate]);

  if (isAuthenticating) return null;

  return <Outlet />;
}

/**
 * RequireBookingRoute
 * Restricts access to Payment and Confirmation pages.
 * Ensures an active booking draft AND a backend-generated `bookingId` exist.
 */
export function RequireBookingRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingState = location.state || bookingStorage.getDraft();
  const hasBookingId = Boolean(bookingState?.bookingId);

  useEffect(() => {
    if (!bookingState) {
      navigate("/storage", { replace: true });
    } else if (!hasBookingId) {
      navigate("/storage/booking", { state: bookingState, replace: true });
    }
  }, [bookingState, hasBookingId, navigate]);

  if (!bookingState || !hasBookingId) return null;

  return <Outlet />;
}