import { Router } from "express";
import { addParking } from "../controllers/parking.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router
  .route("/add-parking")
  .post(upload.fields([{ name: "parkingSlip" }]), verifyJWT, addParking);

export default router;
