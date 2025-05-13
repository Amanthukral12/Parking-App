import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-800 p-5 rounded-full mb-6">
        <MapPin className="w-10 h-10 text-orange-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">
        No parking spots yet
      </h2>
      <p className="text-gray-400 mb-6 max-w-md">
        You haven&apos;t added any parking locations. Start by adding your first
        parking spot.
      </p>
      <Link
        to="/add-parking"
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-white font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105"
      >
        Add Your First Parking
      </Link>
    </div>
  );
};

export default EmptyState;
