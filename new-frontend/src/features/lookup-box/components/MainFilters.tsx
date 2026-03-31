import { Shirt, Package, MapPin } from "lucide-react";


interface MainFiltersProps {
  handleItemFilter: () => void;
  handleBoxFilter: () => void;
  handleLocationFilter: () => void;
}

const MainFilters = ({
  handleItemFilter,
  handleBoxFilter,
  handleLocationFilter,
}: MainFiltersProps) => {

  return (

    <div className="w-full h-full flex flex-col">

      <div className="mb-6 mt-1">
        <h2 className="text-xl text-gray-900 tracking-wide">
          Search
        </h2>
      </div>

      <div className="h-full w-full flex flex-col justify-center gap-6">

        <button 
          className="flex-1 w-full flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-500 
                    text-white p-4 rounded-lg shadow font-bold transition-all duration-300"
          onClick={handleItemFilter}
        >
          <Shirt size={40} />
          <p className="text-xl">By Item</p>
        </button>

        <button 
          className="flex-1 w-full flex items-center justify-center gap-3 bg-orange-400 hover:bg-orange-500
                    text-white p-4 rounded-lg shadow font-bold transition-all duration-300"
          onClick={handleBoxFilter}
        >
          <Package size={40} />
          <p className="text-xl">By Box ID</p>
        </button>

        <button 
          className="flex-1 w-full flex items-center justify-center gap-3 bg-purple-500 hover:bg-purple-600
                    text-white p-4 rounded-lg shadow font-bold transition-all duration-300"
          onClick={handleLocationFilter}
        >
          <MapPin size={40} />
          <p className="text-xl">By Location</p>
        </button>

      </div>

    </div>

  );

};

export default MainFilters;