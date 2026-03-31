import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import ContentCard from "./ContentCard";
import { BoxItem } from "@/types/box";


interface BoxDetailsProps {
  boxId?: string;
  boxName: string;
  icon:string;
  location: string;
  createdAt: string;
  updatedAt: string;
  contents: BoxItem[];
  isMultiSelect?: boolean;
}

const BoxDetails = ({
  boxId,
  boxName,
  location,
  createdAt,
  updatedAt,
  contents,
  isMultiSelect = false,
}: BoxDetailsProps) => {
  const navigate = useNavigate();
  const loc = useLocation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  const LogClick = () => {
    navigate(`/admin/activity-log?box=${encodeURIComponent(boxName)}`)
  };

  const handleEdit = () => {
    // Infer origin from current route
    const baseFrom = loc.pathname.startsWith("/admin")
      ? "/admin/box-lookup"
      : "/box-lookup";
    // Redirect to the create page with the box ID and name as query parameters
    navigate(`/create?boxId=${boxId}&boxName=${boxName}`, {
      state: { from: baseFrom },
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      {!isMultiSelect ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{boxName}</h2>
          </div>
          <p className="text-gray-600 mb-2">Location: {location === "" ? "—" : location}</p>
          <p className="text-gray-600 mb-4">
            Created on: {formatDate(createdAt)}
            <br />
            Updated on: {formatDate(updatedAt)}
          </p>
        </>
      ) : (
        <h2 className="text-xl font-semibold mb-4">Contents selected</h2>
      )}

      <div className="flex justify-between items-center mb-3">
        {!isMultiSelect && (
          <Button
            variant="link"
            className="text-blue-600 pl-0"
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-3 overflow-auto max-h-[65vh]">
        {contents.map((item, idx) => {
          return <ContentCard key={idx} item={item} />;
        })} 
      </div>
    </div>
  );
};

export default BoxDetails;
