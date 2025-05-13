import MapComponent from "./MapComponent.jsx";

const MapSection = ({ markers }) => {
  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] rounded-b-3xl overflow-hidden shadow-xl mb-8 mt-4 md:mt-20  ">
      <div className="absolute inset-0">
        <MapComponent markers={markers} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>

      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md rounded-lg py-2 px-4 text-white text-sm">
        <p className="font-medium">
          {markers.length} Parking Location{markers.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default MapSection;
