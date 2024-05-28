import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserParking } from "../context/ParkingProvider.jsx";

const ParkingDetails = () => {
  const { id: parkingID } = useParams();
  const { getParkingDetail } = UserParking();

  const [parkingDetail, setParkingDetail] = useState({});

  useEffect(() => {
    const fetchParkingDetail = async () => {
      const parking = await getParkingDetail(parkingID);
      console.log(parking);
      setParkingDetail(parking);
    };
    fetchParkingDetail();
  }, [getParkingDetail, parkingID]);
  return (
    <div>
      ParkingDetails
      <p>Title: {parkingDetail.title}</p>
      <p>Note: {parkingDetail.note}</p>
      <p>Pillar Number: {parkingDetail?.pillarNumber}</p>
      <p>Basement Level: {parkingDetail?.basementLevel}</p>
      <div>
        {parkingDetail?.parkingSlip?.map((slip) => (
          <img key={slip._id} src={slip.parkingSlipUrl} alt="" />
        ))}
      </div>
      <iframe
        width="500"
        height="270"
        src={`https://maps.google.com/maps?q=${parkingDetail.latitude},${parkingDetail.longitude}&hl=en&z=14&amp&output=embed`}
      ></iframe>
      <br />
    </div>
  );
};

export default ParkingDetails;
