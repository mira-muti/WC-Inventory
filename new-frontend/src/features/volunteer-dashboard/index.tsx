import { PackagePlus, PackageSearch } from "lucide-react";
import DashboardTile from "./components/dashboard-tile";
import { useNavigate } from "react-router-dom";

const VolunteerDashboard = () => {
  const navigate = useNavigate();

  const tiles = [
    {
      icon: PackageSearch,
      title: "Box Lookup",
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      onClick: () => navigate("/lookup"),
    },

    {
      icon: PackagePlus,
      title: "Create a box",
      bgColor: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      onClick: () =>
        navigate("/create", {
          state: { from: "/box-lookup" },
        }),
    },
  ];

  return (
    <div className="p-4 h-[calc(100vh-120px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {tiles.map((tile, index) => (
          <DashboardTile
            key={index}
            icon={tile.icon}
            title={tile.title}
            bgColor={tile.bgColor}
            hoverColor={tile.hoverColor}
            onClick={tile.onClick} // Navigation handler
          />
        ))}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
