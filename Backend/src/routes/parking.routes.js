import { Router } from "express";
import {
  addParking,
  deleteParking,
  getParkings,
} from "../controllers/parking.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router
  .route("/add-parking")
  .post(upload.fields([{ name: "parkingSlip" }]), verifyJWT, addParking);

router.route("/").get(verifyJWT, getParkings);
router.route("/:id").delete(verifyJWT, deleteParking);

export default router;
