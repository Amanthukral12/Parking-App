import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserParking } from "../context/ParkingProvider.jsx";
import Navbar from "../components/Navbar.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
const settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  lazyLoad: true,
};

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
          <p className="text-[#D9D9D9] text-md my-1 text-2xl">
            {parkingDetail.title}
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
          className="rounded-md"
        ></iframe>

        <a
          href={`https://maps.google.com/maps?q=${parkingDetail.latitude},${parkingDetail.longitude}&hl=en&z=14&amp`}
          target="_blank"
          className="bg-[#E38A1D] rounded-lg text-lg text-[#D9D9D9] py-1 mt-8 mb-5 px-4"
        >
          Get Parking Location
        </a>

        {parkingDetail?.parkingSlip?.length > 1 ? (
          <div className="slider-container w-[90%] text-white mb-4">
            <Slider {...settings}>
              {parkingDetail?.parkingSlip?.map((slip) => (
                <img
                  key={slip._id}
                  src={slip.parkingSlipUrl}
                  className="w-4/5 md:w-1/4 h-[15rem] rounded-md"
                  alt="parking slips"
                />
              ))}
            </Slider>
          </div>
        ) : null}

        {parkingDetail?.parkingSlip?.length === 1 &&
          parkingDetail?.parkingSlip?.map((slip) => (
            <img
              key={slip._id}
              src={slip.parkingSlipUrl}
              className="w-[90%] md:w-1/4 h-[15rem] rounded-md"
              alt="parking slips"
            />
          ))}

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
