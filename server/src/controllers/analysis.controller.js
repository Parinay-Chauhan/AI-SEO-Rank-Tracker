import { asyncHandler } from "../utils/AsyncHandler.js";
import { Analysis } from "../models/analysis.model.js";
import { scrapeUrl } from "../services/scraperService.js";
import { analyzeSeoData } from "../services/geminiService.js";
import { ApiError } from "@google/genai";
//  Analysis a URL

const analyzeUrl = asyncHandler(async (req, res) => {
  try {
    const { url } = req.body;

    if (!url)
      return res
        .status(400)
        .json({ success: false, message: " URl is required " });

    // Validate URL format

    let validUrl;
    try {
      validUrl = new URL(url.startWith("http") ? url : `https://${url}`);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid URL formate" });
    }

    //    Create analysis record with pending status

    const analysis = await Analysis.create({
      userId: req.userId,
      url: validUrl.href,
      status: "processing",
    });

    //    Send immediate response with analysis ID
    res.json({
      success: true,
      message: "Analysis started",
      analysisId: analysis._id,
    });

    // Run scraping and analysis in background
    try {
      // step 1: Scrap the URl with BrowserBase
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
      } catch (saveError) {}
      console.error("Failed to save failed status : ", saveError.message);
    }
  } catch (error) {
    console.error("Analyze URL error : ", error.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
});

// Get analysis by ID
const getAnalysis = asyncHandler(async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!analysis) {
      throw new ApiError(404, "Analysis not found");
    }

    res.json({ success: true, analysis });
  } catch (error) {
    console.error("Get analysis error : ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//  Get all analyses for user
const getAnalyses = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.queery.page) || 1;
    const limit = parseInt(req.queery.limit) || 10;
    const skip = (page - 1) * limit;

    const analyses = (await Analysis.find({ userId: req.userId }))
      .toSorted({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-issue -keyword");

    const total = await Analysis.countDocuments({ userId: req.userId });

    res.json({
      success: true,
      analyses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get analyses error : ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// Delete analysis
const deleteAnalysis = asyncHandler(async (req, res) => {
  try {
    await Analysis.findByIdAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    res.json({ success: true, message: "Analysis deleted" });
  } catch (error) {
    console.error("Deleted analysis error : ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export { analyzeUrl, getAnalysis, getAnalyses, deleteAnalysis };
