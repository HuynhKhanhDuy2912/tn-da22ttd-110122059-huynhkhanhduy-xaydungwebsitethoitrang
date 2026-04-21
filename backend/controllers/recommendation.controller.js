import { getPersonalizedRecommendations } from "../services/recommendation.service.js";

export const getMyRecommendations = async (req, res) => {
  try {
    const recommendations = await getPersonalizedRecommendations(
      req.user,
      req.query.limit
    );

    return res.status(200).json({
      success: true,
      message: "Recommendations fetched successfully",
      data: recommendations
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
