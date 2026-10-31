import { asyncHandler } from "../utils/AsyncHandler";
import { Analysis } from "../models/analysis.model.js";
import { scrapeUrl } from "../services/scraperService.js";
import { analyzeSeoData } from "../services/geminiService.js";
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

      const aiResult = await analyzeSeoData(scrapeResult.data)

      if(!aiResult.success){
        analysis.status = "failed";
        await analysis.save()
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

      } console.error("Failed to save failed status : ", saveError.message);
    }
  } catch (error) {
    console.error("Analyze URL error : ", error.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
});

// Get analysis by ID
const getAnalysis = asyncHandler(async (req, res) => {});
//  Get all analyses for user
const getAnalyses = asyncHandler(async (req, res) => {});
// Delete analysis
const deleteAnalysis = asyncHandler(async (req, res) => {});

export { analyzeUrl, getAnalysis, getAnalyses, deleteAnalysis };
