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
      userId: req.userId,
      keyword: keyword.toLowerCase().trim(),
      domain,
    });

    if (existing) {
      throw new ApiError(400, "Already tracking this keyword for this domain");
    }

    // Create tracking entry
    const tracking = await KeywordTracking.create({
      userId: req.userId,
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
    console.error("Add keyword error : ", error.message);
    if (error.code === 11000)
      return res
        .status(400)
        .json({ success: false, message: "Already tracking this keyworf" });
    throw new ApiError(409, "Server error");
  }
});

const getKeywords = asyncHandler(async (req, res) => {
  try {
    const keywords = await KeywordTracking.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("-rankHistory");
    res.json({ success: true, keywords });
  } catch (error) {
    console.error("Get keywords error :", error.message);
    throw new ApiError(500, "Server error");
  }
});

const getKeyword = asyncHandler(async (req, res) => {
  try {
    const tracking = await KeywordTracking.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!tracking)
      return res
        .status(404)
        .json(new ApiResponse(404, "keyword tracking noot found"));
    res.json({ success: true, tracking });
  } catch (error) {
    console.error("Get keyword error :", error.message);
    throw new ApiError(500, "Server error");
  }
});

const refreshKeyword = asyncHandler(async (req, res) => {
  try {
    const tracking = await KeywordTracking.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!tracking)
      return res
        .status(404)
        .json(new ApiResponse(404, "keyword tracking noot found"));
    tracking.status = "checking";
    await tracking.save();
    res.json({ success: true, message: "Rank check started" });
    keywordTracking(tracking);
  } catch (error) {
    console.error("Refresh keyword error :", error.message);
    throw new ApiError(500, "Server error");
  }
});

const deleteKeyword = asyncHandler(async (req, res) => {
  try {
    const tracking = await KeywordTracking.findByIdAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!tracking)
      return res
        .status(404)
        .json(new ApiResponse(404, "keyword tracking noot found"));
    res.json({ success: true, message: "Keyword tracking deleted" });
  } catch (error) {
    console.error("Delete keyword error :", error.message);
    throw new ApiError(500, "Server error");
  }
});

const toggleTracking = asyncHandler(async (req, res) => {
  try {
    const tracking = await KeywordTracking.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!tracking)
      return res
        .status(404)
        .json(new ApiResponse(404, "keyword tracking noot found"));

    tracking.active = !tracking.active;
    await tracking.save();

    res.json({ success: true, tracking });
  } catch (error) {
    console.error("toggleTracking error :", error.message);
    throw new ApiError(500, "Server error");
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
