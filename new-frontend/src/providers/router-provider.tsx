import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Layout from "@/components/layout";
import { useAuthContext } from "@/contexts/auth-context";
import LoadingScreen from "@/components/loading";
import LoginPage from "@/features/auth/login";
import AdminDashboard from "@/features/admin-dashboard";
import VolunteerDashboard from "@/features/volunteer-dashboard";
import CategoryManagement from "@/features/admin-dashboard/tabs/category-management";
import LocationManagement from "@/features/admin-dashboard/tabs/location-management";
import UserManagement from "@/features/admin-dashboard/tabs/user-management";
import UnauthorizedPage from "@/features/auth/unauthorized";
import ActivityLog from "@/features/admin-dashboard/tabs/activity-log";
import UserInfo from "@/features/user-info";
import AddBox from "@/features/add-box";
import SizeManagementPage from "@/features/admin-dashboard/tabs/size-management";
import SizeManagement from "@/features/admin-dashboard/tabs/size-management";
import Inventory from "@/features/admin-dashboard/tabs/inventory";
import CreateBoxes from "@/features/admin-dashboard/tabs/create-boxes";
import BoxLookup from "@/features/admin-dashboard/tabs/box-lookup";
import Donations from "@/features/admin-dashboard/tabs/donations";
import AdminOverview from "@/features/admin-dashboard/components/AdminOverview.tsx";
import { LookupStateProvider } from "@/features/lookup-box";
import LookupBox from "@/features/lookup-box/pages/LookupBox";
import ViewContents from "@/features/lookup-box/pages/ViewContents";
import FilterResults from "@/features/lookup-box/pages/FilterResults";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  roles?: string[];
}

const AuthWrapper = ({ children, roles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // if (roles && !roles.includes(user.user_metadata.role!)) {
  if (false) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

const VolunteerWrapper = ({ children }: ProtectedRouteProps) => {
  return (
    <AuthWrapper>
      <Layout>{children}</Layout>
    </AuthWrapper>
  );
};

const AdminWrapper = ({ children }: ProtectedRouteProps) => {
  return <AuthWrapper roles={["admin"]}>{children}</AuthWrapper>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <VolunteerWrapper>
        <VolunteerDashboard />
      </VolunteerWrapper>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminWrapper>
        <AdminDashboard />
      </AdminWrapper>
    ),
    children: [
      {
        index: true,
        element: <AdminOverview />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "create-boxes",
        element: <CreateBoxes />,
      },
      {
        path: "users/:id",
        element: <UserInfo />,
      },

      {
        path: "locations",
        element: <LocationManagement />,
      },
      {
        path: "categories",
        element: <CategoryManagement />,
      },
      { path: "size-management", element: <SizeManagementPage /> },
      {
        path: "activity-log",
        element: <ActivityLog />,
      },
      {
        path: "sizes",
        element: <SizeManagement />,
      },
      {
        path: "box-lookup",
        element: <BoxLookup />,
      },
      {
        path: "donations",
        element: <Donations />,
      },
    ],
  },
  {
    path: "/create",
    element: (
      <VolunteerWrapper>
        <AddBox />
      </VolunteerWrapper>
    ),
  },
  // {
  //   path: "searchforbox",
  //   element: (
  //     <VolunteerWrapper>
  //       <SearchForBoxByIdPage />
  //     </VolunteerWrapper>
  //   ),
  // },
  // {
  //   path: "search-for-item",
  //   element: (
  //     <VolunteerWrapper>
  //       <SearchForItem />
  //     </VolunteerWrapper>
  //   ),
  // },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/lookup",
    element: (
      <VolunteerWrapper>
        <LookupStateProvider>
          <Outlet />
        </LookupStateProvider>
      </VolunteerWrapper>
    ),
    children: [
      { index: true, element: <LookupBox /> },
      { path: "filter-results", element: <FilterResults /> },
      { path: "filter-results/view-contents", element: <ViewContents /> }
    ],
  }
]);

export default router;
