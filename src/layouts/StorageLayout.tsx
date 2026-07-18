import { Outlet, ScrollRestoration } from "react-router";

export default function StorageLayout() {
  return (
    <div className=" bg-background text-text-main font-sans">
      <ScrollRestoration />
      <Outlet />
    </div>
  );
}
