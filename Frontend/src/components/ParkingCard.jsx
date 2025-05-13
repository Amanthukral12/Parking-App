import { Link, useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { Trash2, Navigation, Calendar, MapPin } from "lucide-react";

const ParkingCard = ({
  id,
  title,
  onDelete,
  latitude,
  longitude,
  createdAt,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="relative group overflow-hidden bg-gray-900 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 hover:scale-[1.02]">
      <Link to={`/${id}`} className="block p-5 h-full">
        <div className="flex flex-col h-full">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-xl font-semibold text-white truncate">
              {title}
            </h3>
            <div className="flex space-x-1 text-gray-400 text-sm">
              <MapPin className="w-4 h-4" />
              <span className="hidden md:inline">
                {latitude.toFixed(5)}, {longitude.toFixed(5)}
              </span>
            </div>
          </div>

          <div className="mt-auto flex items-center text-gray-400 text-sm">
            <Navigation className="w-4 h-4 mr-1" />
            <span>Navigate</span>

            {createdAt && (
              <div className="ml-auto flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatDate(createdAt)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Action buttons */}
      <div className="absolute -right-20 top-4 flex space-x-2 transition-all duration-300 group-hover:right-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/update/${id}`);
          }}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          aria-label="Edit parking"
        >
          <MdEdit className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(id);
          }}
          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          aria-label="Delete parking"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ParkingCard;
