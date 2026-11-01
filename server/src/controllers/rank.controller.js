import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { KeywordTracking } from "../models/keywordTracking.model.js";
import { keywordTracking } from "../services/keywordTrackingService.js";

const addKeyword = asyncHandler(async (req, res) => {
  const { keyword, url } = req.body;

  if (!keyword || !url) {
    throw new ApiError(400, "Keyword and URL are required");
  }

  // Extract domain from URL
  let domain;
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    domain = urlObj.hostname.replace("www.", "");
  } catch (error) {
    throw new ApiError(400, "Invalid URL format");
  }

  // Check if already tracking this keyword+domain
  const existing = await KeywordTracking.findOne({
    userId: req.user._id,
    keyword: keyword.toLowerCase().trim(),
    domain,
  });

  if (existing) {
    throw new ApiError(409, "Already tracking this keyword for this domain");
  }

  // Create tracking entry
  const tracking = await KeywordTracking.create({
    userId: req.user._id,
    keyword: keyword.toLowerCase().trim(),
    url: url.startsWith("http") ? url : `https://${url}`,
    domain,
    status: "checking",
  });

  await keywordTracking(tracking);

  return res
    .status(201)
    .json(new ApiResponse(201, tracking, "Keyword tracking started"));
});

const getKeywords = asyncHandler(async (req, res) => {
  const keywords = await KeywordTracking.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .select("-rankHistory");

  return res
    .status(200)
    .json(new ApiResponse(200, keywords, "Keywords fetched successfully"));
});

const getKeyword = asyncHandler(async (req, res) => {
  const tracking = await KeywordTracking.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!tracking) {
    throw new ApiError(404, "Keyword tracking not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { tracking },
        "Keyword tracking fetched successfully"
      )
    );
});

const refreshKeyword = asyncHandler(async (req, res) => {
  const tracking = await KeywordTracking.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!tracking) {
    throw new ApiError(404, "Keyword tracking not found");
  }

  tracking.status = "checking";
  await tracking.save();

  void keywordTracking(tracking);

  return res
    .status(202)
    .json(new ApiResponse(202, tracking, "Rank check started"));
});

const deleteKeyword = asyncHandler(async (req, res) => {
  const tracking = await KeywordTracking.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!tracking) {
    throw new ApiError(404, "Keyword tracking not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Keyword tracking deleted"));
});

const toggleTracking = asyncHandler(async (req, res) => {
  const tracking = await KeywordTracking.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!tracking) {
    throw new ApiError(404, "Keyword tracking not found");
  }

  tracking.active = !tracking.active;
  await tracking.save();

  return res
    .status(200)
    .json(new ApiResponse(200, tracking, "Tracking status updated"));
});

export {
  addKeyword,
  getKeyword,
  getKeywords,
  refreshKeyword,
  deleteKeyword,
  toggleTracking,
};
