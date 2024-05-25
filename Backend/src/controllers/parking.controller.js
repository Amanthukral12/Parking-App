import { Parking } from "../models/parking.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

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
      parkingSlipImageList.push({
        parkingSlipUrl: result?.url,
        public_id: result?.public_id,
      });
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

const getParkings = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const parkings = await Parking.find({
    owner: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, parkings, "Parkings fetched successfully"));
});

const deleteParking = asyncHandler(async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);
    if (!parking) {
      throw new ApiError(
        401,
        {},
        "Error while deleting the parking. Please try again"
      );
    }

    const parkingId = parking._id;
    const user = await User.findById(req.user.id);
    if (user) {
      await user.parkings.pull(parkingId);
      await user.save();
    }
    for (let i = 0; i < parking.parkingSlip.length; i++) {
      await deleteFromCloudinary(parking.parkingSlip[i].public_id);
    }
    await Parking.deleteOne({ _id: parking._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Parking deleted successfully"));
  } catch (error) {
    throw new ApiError(
      404,
      {},
      error || "Error while deleting the parking. Please try again"
    );
  }
});

const getParkingDetail = asyncHandler(async (req, res) => {
  const parkingId = req.params?.id;
  let parking = await Parking.findById(parkingId);
  if (!parking) {
    throw new ApiError(404, {}, "No Parking found");
  }

  res.status(200).json(parking);
});

const updateParking = asyncHandler(async (req, res) => {
  const { longitude, latitude, title, note, basementLevel, pillarNumber } =
    req.body;

  const parkingId = req.params?.id;
  let parking = await Parking.findById(parkingId);
  if (!parking) {
    throw new ApiError(404, {}, "No Parking found");
  }

  parking.longitude = longitude;
  parking.latitude = latitude;
  parking.title = title;
  parking.note = note;
  parking.basementLevel = basementLevel;
  parking.pillarNumber = pillarNumber;

  if (
    req.files &&
    Array.isArray(req.files.parkingSlip) &&
    req.files.parkingSlip.length > 0
  ) {
    for (let i = 0; i < parking.parkingSlip.length; i++) {
      await deleteFromCloudinary(parking.parkingSlip[i].public_id);
    }

    let parkingSlipImageList = [];

    for (let i = 0; i < req.files.parkingSlip.length; i++) {
      let parkingSlipImageLocalPath = req.files.parkingSlip[i].path;

      let result = await uploadOnCloudinary(
        parkingSlipImageLocalPath,
        "Parking-app/ParkingPhotos"
      );
      parkingSlipImageList.push({
        parkingSlipUrl: result?.url,
        public_id: result?.public_id,
      });
    }
    parking.parkingSlip = parkingSlipImageList;
  }

  await parking.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, parking, "Parking details updated successfully")
    );
});

export {
  addParking,
  getParkings,
  deleteParking,
  updateParking,
  getParkingDetail,
};
