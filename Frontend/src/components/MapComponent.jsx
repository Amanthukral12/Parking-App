import {
  APIProvider,
  InfoWindow,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";
import { createRef, useCallback, useRef, useState } from "react";

const mapContainerStyle = {
  width: "80%",
  height: "400px",
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: "15px",
};

const MapComponent = ({ markers }) => {
  const [infoWindowShown, setInfoWindowShown] = useState(null);
  const markerRefs = useRef({});
  const handleMarkerClick = useCallback((id) => {
    setInfoWindowShown(id);
  }, []);

  const handleClose = useCallback(() => setInfoWindowShown(null), []);
  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <Map
        defaultZoom={15}
        center={{ lat: 28.628737, lng: 77.309971 }}
        style={mapContainerStyle}
      >
        {markers.map((mark) => {
          if (!markerRefs.current[mark.id]) {
            markerRefs.current[mark.id] = createRef();
          }
          return (
            <div key={mark.id}>
              <Marker
                position={mark.position}
                onClick={() => handleMarkerClick(mark.id)}
                ref={markerRefs.current[mark.id]}
              ></Marker>
              {infoWindowShown === mark.id && (
                <InfoWindow
                  anchor={markerRefs.current[mark.id].current}
                  onClose={handleClose}
                >
                  <h2>{mark.name}</h2>
                </InfoWindow>
              )}
            </div>
          );
        })}
      </Map>
    </APIProvider>
  );
};

export default MapComponent;
