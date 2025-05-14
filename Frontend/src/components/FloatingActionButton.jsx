import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const FloatingActionButton = ({ to }) => {
  return (
    <div className="fixed bottom-8 right-8 z-20">
      <Link
        to={to}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        aria-label="Add new parking"
      >
        <Plus className="w-7 h-7" />
      </Link>
    </div>
  );
};

export default FloatingActionButton;
