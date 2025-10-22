import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../utils/dispatch";

export default function PublicRoute() {
  const token = useAppSelector((state) => state.auth.token);

  // Jika sudah login, redirect ke dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Kalau belum login, tampilkan halaman publik (login/register)
  return <Outlet />;
}
