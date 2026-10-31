import { Router } from "express";


import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { analyzeUrl, deleteAnalysis, getAnalyses, getAnalysis } from "../controllers/analysis.controller.js";

const analysisRouter = Router();

analysisRouter.route('/analyze').post(verifyJWT, analyzeUrl);
analysisRouter.route('/list').get(verifyJWT, getAnalyses);
analysisRouter.route('/:id').get(verifyJWT, getAnalysis);
analysisRouter.route('/:id').delete(verifyJWT, deleteAnalysis);


export default analysisRouter;