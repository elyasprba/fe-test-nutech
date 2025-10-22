import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MessageProvider } from "./context/MessageProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import PrivateRoute from "./components/private-routes";
import PublicRoute from "./components/public-routes";

import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Topup from "./pages/topup";
import Transaction from "./pages/transaction";

function App() {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MessageProvider>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Route>

              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/topup" element={<Topup />} />
                <Route path="/transaction" element={<Transaction />} />
              </Route>

              <Route
                path="*"
                element={
                  <div className="flex justify-center items-center min-h-screen text-3xl font-semibold">
                    404 - Halaman tidak ditemukan
                  </div>
                }
              />
            </Routes>
          </MessageProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
