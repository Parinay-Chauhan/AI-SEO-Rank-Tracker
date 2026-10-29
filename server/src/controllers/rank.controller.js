import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { KeywordTracking } from "../models/keywordTracking.model.js";
import { keywordTracking } from "../services/keywordTrackingService.js";

const addKeyword = asyncHandler(async (req, res) => {
  try {
    const { keyword, url } = req.body;

    if (!keyword || !url) {
      throw new ApiError(400, "keyword and URL are required");
    }

    //   Extract domain from URL
    let domain;
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      domain = urlObj.hostname.replace("www.", "");
    } catch (error) {
      throw new ApiError(400, "Invalid URL format");
      // return res.json(new ApiResponse(400, "Invalid URL format"));
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
      .json(new ApiResponse(201, tracking, "keyword tracking started"));
  } catch (error) {
    console.error("Add keyword error:", error.message);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error.code === 11000) {
      throw new ApiError(409, "Already tracking this keyword for this domain");
    }

    throw new ApiError(500, "Failed to add keyword");
  }
});

const getKeywords = asyncHandler(async (req, res) => {
  try {
    const keywords = await KeywordTracking.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select("-rankHistory");
    return res
      .status(200)
      .json(new ApiResponse(200, keywords, "Keywords fetched successfully"));
  } catch (error) {
    console.error("getKeywords error:", error.message);
    throw error;
  }
});

const getKeyword = asyncHandler(async (req, res) => {
  try {
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
        new ApiResponse(200, tracking, "Keyword tracking fetched successfully")
      );
  } catch (error) {
    console.error("getKeyword error:", error.message);
    throw error;
  }
});

const refreshKeyword = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error("refreshKeyword error:", error.message);
    throw error;
  }
});

const deleteKeyword = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error("deleteKeyword error:", error.message);
    throw error;
  }
});

const toggleTracking = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error("toggleTracking error:", error.message);
    throw error;
  }
});

export {
  addKeyword,
  getKeyword,
  getKeywords,
  refreshKeyword,
  deleteKeyword,
  toggleTracking,
};
