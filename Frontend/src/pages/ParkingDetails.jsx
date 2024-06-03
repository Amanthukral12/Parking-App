import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserParking } from "../context/ParkingProvider.jsx";
import Navbar from "../components/Navbar.jsx";
const ParkingDetails = () => {
  const { id: parkingID } = useParams();
  const { getParkingDetail } = UserParking();
  const navigate = useNavigate();

  const [parkingDetail, setParkingDetail] = useState({});

  useEffect(() => {
    const fetchParkingDetail = async () => {
      try {
        const parking = await getParkingDetail(parkingID);
        setParkingDetail(parking);
      } catch (error) {
        if (error.response.status === 404) {
          navigate("/");
        }
      }
    };
    fetchParkingDetail();
  }, [getParkingDetail, navigate, parkingID]);

  const getDownloadableImageLinks = () => {
    const urls = [];
    parkingDetail.parkingSlip.map((slip) => urls.push(slip.parkingSlipUrl));
    var modifiedUrls = urls.map((url) =>
      url.replace("upload", "upload/fl_attachment")
    );
    modifiedUrls.map((url) => window.open(url, "_blank", "noreferrer"));
  };

  return (
    <div className="bg-black min-h-[100vh]">
      <div className="w-full flex justify-center sticky top-0 z-10 mb-4">
        <Navbar />
      </div>
      <section className="flex flex-col items-center">
        <h1 className="text-[#D9D9D9] text-2xl my-4">Parking Details</h1>
        <div className="border-2 border-gray-400 py-4 px-6 mb-4 rounded-md w-4/5">
          <p className="text-[#D9D9D9] text-md my-1">
            Title: {parkingDetail.title}
          </p>
          <p className="text-[#D9D9D9] text-md my-1">
            Note:{" "}
            {parkingDetail.note
              ? parkingDetail.note
              : "No Parking Note entered"}
          </p>
          <p className="text-[#D9D9D9] text-md my-1">
            Pillar Number:{" "}
            {parkingDetail?.pillarNumber
              ? parkingDetail?.pillarNumber
              : "No Pillar Number entered"}
          </p>
          <p className="text-[#D9D9D9] text-md my-1 ">
            Basement Level:{" "}
            {parkingDetail?.basementLevel
              ? parkingDetail?.basementLevel
              : "No Basement Level entered"}
          </p>
        </div>

        <iframe
          width="400"
          height="270"
          src={`https://maps.google.com/maps?q=${parkingDetail.latitude},${parkingDetail.longitude}&hl=en&z=14&amp&output=embed`}
        ></iframe>

        <a
          href={`https://maps.google.com/maps?q=${parkingDetail.latitude},${parkingDetail.longitude}&hl=en&z=14&amp`}
          target="_blank"
          className="bg-[#E38A1D] rounded-lg text-lg text-[#D9D9D9] py-1 mt-8 mb-5 px-4"
        >
          Get Parking Location
        </a>

        <button
          onClick={() => getDownloadableImageLinks()}
          className="bg-[#E38A1D] rounded-lg text-lg text-[#D9D9D9] py-1 mt-4 mb-5 px-4"
        >
          Download Images
        </button>
      </section>
    </div>
  );
};

export default ParkingDetails;
