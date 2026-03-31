import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import { ReactQueryProvider } from "./providers/react-query-provider";
import router from "./providers/router-provider";
import LoadingScreen from "./components/loading";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        
        <RouterProvider router={router} fallbackElement={<LoadingScreen />} />
        <Toaster />
      </AuthProvider>
    </ReactQueryProvider>
  );
}

export default App;
