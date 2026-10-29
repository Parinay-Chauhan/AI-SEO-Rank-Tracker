import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {
  addKeyword,
  deleteKeyword,
  getKeyword,
  getKeywords,
  refreshKeyword,
  toggleTracking,
} from "../controllers/rank.controller.js";

const rankRouter = Router();

rankRouter.route("/add").post(verifyJWT, addKeyword);
rankRouter.route("/list").get(verifyJWT, getKeywords);
rankRouter.route("/:id").get(verifyJWT, getKeyword);
rankRouter.route("/:id/refresh").post(verifyJWT, refreshKeyword);
rankRouter.route('/:id/toggle').put(verifyJWT, toggleTracking);
rankRouter.route('/:id').delete(verifyJWT, deleteKeyword);




export default rankRouter;
