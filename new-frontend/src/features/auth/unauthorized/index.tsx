import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ShieldX, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center space-y-8">
          <ShieldX className="w-20 h-20 sm:w-24 sm:h-24 text-red-500" />

          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Unauthorized Access
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>

          <Button
            onClick={() => navigate("/")}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto min-w-[200px]"
            variant="default"
            size="lg"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
