import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Analysis } from "../models/analysis.model.js";
import { scrapeUrl } from "../services/scraperService.js";
import { analyzeSeoData } from "../services/geminiService.js";

// Analyze a URL
const analyzeUrl = asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!url) {
    throw new ApiError(400, "URL is required");
  }

  // Validate URL format
  let validUrl;
  try {
    validUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
  } catch (error) {
    throw new ApiError(400, "Invalid URL format");
  }

  // Create analysis record with pending status
  const analysis = await Analysis.create({
    userId: req.user._id,
    url: validUrl.href,
    status: "processing",
  });

  // Send immediate response with analysis ID
  res.status(200).json(
    new ApiResponse(
      200,
      { analysisId: analysis._id },
      "Analysis started"
    )
  );

  // Run scraping and analysis in background
  try {
    // Step 1: Scrape the URL with BrowserBase
    const scrapeResult = await scrapeUrl(validUrl.href);

    if (!scrapeResult.success) {
      analysis.status = "failed";
      await analysis.save();
      return;
    }

    // Step 2: Analyze with Gemini AI
    const aiResult = await analyzeSeoData(scrapeResult.data);

    if (!aiResult.success) {
      analysis.status = "failed";
      await analysis.save();
      return;
    }

    // Step 3: Save results
    analysis.overallScore = aiResult.data.overallScore || 0;
    analysis.categories = aiResult.data.categories || {};
    analysis.metaData = aiResult.data.metaData || {};
    analysis.headings = aiResult.data.headings || {};
    analysis.links = aiResult.data.links || {};
    analysis.images = aiResult.data.images || {};
    analysis.keywords = aiResult.data.keywords || {};
    analysis.issues = aiResult.data.issues || {};
    analysis.loadTime = aiResult.data.loadTime || 0;
    analysis.pageSize = aiResult.data.pageSize || 0;
    analysis.wordCount = aiResult.data.wordCount || 0;
    analysis.status = "completed";

    await analysis.save();
  } catch (bgError) {
    console.error("Background analysis error: ", bgError.message);
    try {
      analysis.status = "failed";
      await analysis.save();
    } catch (saveError) {
      console.error("Failed to save failed status: ", saveError.message);
    }
  }
});

// Get analysis by ID
const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!analysis) {
    throw new ApiError(404, "Analysis not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { analysis }, "Analysis fetched successfully"));
});

// Get all analyses for user
const getAnalyses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const analyses = await Analysis.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-issues -keywords");

  const total = await Analysis.countDocuments({ userId: req.user._id });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        analyses,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
      "Analyses fetched successfully"
    )
  );
});

// Delete analysis
const deleteAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!analysis) {
    throw new ApiError(404, "Analysis not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Analysis deleted successfully"));
});

export { analyzeUrl, getAnalysis, getAnalyses, deleteAnalysis };
