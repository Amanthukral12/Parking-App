import { Router } from "express";
import {
  addParking,
  deleteParking,
  getParkings,
  updateParking,
  getParkingDetail,
} from "../controllers/parking.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router
  .route("/add-parking")
  .post(upload.fields([{ name: "parkingSlip" }]), verifyJWT, addParking);

router.route("/").get(verifyJWT, getParkings);
router
  .route("/:id")
  .get(verifyJWT, getParkingDetail)
  .delete(verifyJWT, deleteParking)
  .put(upload.fields([{ name: "parkingSlip" }]), verifyJWT, updateParking);

export default router;
