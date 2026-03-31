import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Shield } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const getInitials = () => {
    return user?.email?.substring(0, 2).toUpperCase() ?? "U";
  };

  const isAdmin = () => {
    // return user?.user_metadata?.role === "admin";
    return true;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-950">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="/icons/logo.png"
                alt="Company Logo"
              />
            </div>
            <h1 className="text-lg font-semibold">WC</h1>

            <nav className="md:flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-sm font-medium"
                onClick={() => navigate("/")}
              >
                Home
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 font-medium">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                {isAdmin() && (
                  <DropdownMenuItem
                    onClick={() => navigate("/admin")}
                    className="text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem className="h-px bg-gray-200 dark:bg-gray-700 p-0 m-1" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 dark:text-red-400 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
