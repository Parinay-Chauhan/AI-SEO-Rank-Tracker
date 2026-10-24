import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { KeywordTracking } from "../models/keywordTracking.model.js";

const addKeyword = asyncHandler(async (req, res) => {
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
    return res.json(new ApiResponse(400, "Invalid URL format"));
  }

  const existring = await KeywordTracking.findOne({
    userId: req.userId,
    keyword: keyword.toLowerCase().trim,
    domain,
  });

  if (existring) {
    throw new ApiError(400, "Already tracking this keyword for this domain");
  }

  const tracking = await KeywordTracking.create({
    userId: req.userId,
    keyword: keyword.toLowerCase().trim(),
    url: url.startsWith("http") ? url : `https://${url}`,
    domain,
    status: "checking",
  });

  return res
  .status(201)
  .json(new ApiResponse( tracking, "keyword tracking started"));

  

});

const getKeywords = asyncHandler(async (req, res) => {});

const getKeyword = asyncHandler(async (req, res) => {});

const refreshKeyword = asyncHandler(async (req, res) => {});

const deleteKeyword = asyncHandler(async (req, res) => {});

const toggleTracking = asyncHandler(async (req, res) => {});

export {
  addKeyword,
  getKeyword,
  getKeywords,
  refreshKeyword,
  deleteKeyword,
  toggleTracking,
};
