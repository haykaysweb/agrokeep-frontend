import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Routes from "./routes/Routes";
import AuthProvider from "./context/AuthContext";
import { TopLoader } from "./components/ui/TopLoader";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TopLoader />
      <AuthProvider>
        <Routes />
      </AuthProvider>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="light"
        icon={false}
        toastClassName={() =>
          "relative flex p-4 md:p-6 min-h-10 rounded-2xl justify-between overflow-hidden cursor-pointer bg-white border border-stone-100 shadow-xl mb-3 font-sans"
        }
      />
    </QueryClientProvider>
  );
}

export default App;
