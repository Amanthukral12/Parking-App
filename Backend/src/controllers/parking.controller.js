import { Parking } from "../models/parking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addParking = asyncHandler(async (req, res) => {
  const { longitude, latitude, title, note, basementLevel, pillarNumber } =
    req.body;

  let parkingSlipImageList = [];

  if (
    req.files &&
    Array.isArray(req.files.parkingSlip) &&
    req.files.parkingSlip.length > 0
  ) {
    for (let i = 0; i < req.files.parkingSlip.length; i++) {
      let parkingSlipImageLocalPath = req.files.parkingSlip[i].path;

      let result = await uploadOnCloudinary(
        parkingSlipImageLocalPath,
        "Parking-app/ParkingPhotos"
      );
      parkingSlipImageList.push(result?.url);
    }
  }
  const parking = await Parking.create({
    longitude: longitude || "",
    latitude: latitude || "",
    title: title || "",
    note: note || "",
    basementLevel: basementLevel || "",
    pillarNumber: pillarNumber || "",
    parkingSlip: parkingSlipImageList || [],
    owner: req.user.id,
  });

  if (!parking) {
    throw new ApiError(500, "Something went wrong while adding the parking");
  }
  return res.status(200).json(new ApiResponse(200, parking, "Parking Added"));
});

export { addParking };
