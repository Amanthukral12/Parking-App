import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserParking } from "../context/ParkingProvider.jsx";
import Navbar from "../components/Navbar.jsx";
import {
  MapPin,
  Navigation,
  Download,
  ClipboardList,
  Building,
  Layers,
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  lazyLoad: true,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  arrows: true,
};

const ParkingDetails = () => {
  const { id: parkingID } = useParams();
  const { getParkingDetail } = UserParking();
  const navigate = useNavigate();
  const [parkingDetail, setParkingDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParkingDetail = async () => {
      try {
        setIsLoading(true);
        const parking = await getParkingDetail(parkingID);
        setParkingDetail(parking);
      } catch (error) {
        if (error.response?.status === 404) {
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchParkingDetail();
  }, [getParkingDetail, navigate, parkingID]);

  const getDownloadableImageLinks = () => {
    const urls =
      parkingDetail.parkingSlip?.map((slip) => slip.parkingSlipUrl) || [];
    const modifiedUrls = urls.map((url) =>
      url.replace("upload", "upload/fl_attachment")
    );
    modifiedUrls.forEach((url) => window.open(url, "_blank"));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      <div className="w-full sticky top-0 z-10">
        <Navbar />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
                <ClipboardList className="w-8 h-8 mr-3 text-orange-500" />
                {parkingDetail.title}
              </h1>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Note</p>
                      <p className="text-white">
                        {parkingDetail.note || "No parking note entered"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Building className="w-5 h-5 text-orange-500 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Pillar Number</p>
                      <p className="text-white">
                        {parkingDetail.pillarNumber ||
                          "No pillar number entered"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Layers className="w-5 h-5 text-orange-500 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Basement Level</p>
                      <p className="text-white">
                        {parkingDetail.basementLevel ||
                          "No basement level entered"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="250"
                    src={`https://maps.google.com/maps?q=${parkingDetail.latitude},${parkingDetail.longitude}&hl=en&z=14&output=embed`}
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-800/50">
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a
                  href={`https://maps.google.com/maps?q=${parkingDetail.latitude},${parkingDetail.longitude}&hl=en&z=14`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-white font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Navigate to Parking
                </a>

                {parkingDetail.parkingSlip &&
                  parkingDetail.parkingSlip.length > 0 && (
                    <button
                      onClick={getDownloadableImageLinks}
                      className="inline-flex items-center px-6 py-3 bg-gray-700 rounded-full text-white font-medium shadow-lg hover:bg-gray-600 transition-all duration-300"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Images
                    </button>
                  )}
              </div>
            </div>
          </div>

          {parkingDetail.parkingSlip &&
            parkingDetail.parkingSlip.length > 0 && (
              <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Parking Slips
                </h2>
                {parkingDetail.parkingSlip.length > 1 ? (
                  <div className="max-w-2xl mx-auto">
                    <Slider {...settings}>
                      {parkingDetail.parkingSlip.map((slip) => (
                        <div key={slip._id} className="px-2">
                          <img
                            src={slip.parkingSlipUrl}
                            className="rounded-lg w-full h-[300px] object-cover"
                            alt="Parking slip"
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto">
                    <img
                      src={parkingDetail.parkingSlip[0].parkingSlipUrl}
                      className="rounded-lg w-full h-[300px] object-cover"
                      alt="Parking slip"
                    />
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ParkingDetails;
