import UserBehavior from "../models/UserBehavior.js";
import { createCrudControllers } from "./base.controller.js";

const baseUserBehaviorController = createCrudControllers(UserBehavior, {
  modelName: "UserBehavior",
  populate: [
    { path: "userId", select: "username email" },
    { path: "productId", select: "name price" },
    { path: "outfitId", select: "name style occasion" },
    { path: "metadata.categoryId", select: "name" }
  ]
});

export const trackBehavior = async (req, res) => {
  try {
    const behavior = await UserBehavior.create({
      ...req.body,
      userId: req.user._id
    });

    const populatedBehavior = await UserBehavior.findById(behavior._id)
      .populate("userId", "username email")
      .populate("productId", "name price style")
      .populate("outfitId", "name style occasion")
      .populate("metadata.categoryId", "name");

    return res.status(201).json({
      success: true,
      message: "Behavior tracked successfully",
      data: populatedBehavior
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getBehaviorSummary = async (req, res) => {
  try {
    const behaviors = await UserBehavior.find({ userId: req.user._id }).sort({
      createdAt: -1
    });

    const summary = behaviors.reduce((accumulator, item) => {
      accumulator[item.actionType] = (accumulator[item.actionType] || 0) + 1;
      return accumulator;
    }, {});

    return res.status(200).json({
      success: true,
      message: "Behavior summary fetched successfully",
      data: {
        totalEvents: behaviors.length,
        actionSummary: summary,
        latestEvents: behaviors.slice(0, 10)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  ...baseUserBehaviorController,
  trackBehavior,
  getBehaviorSummary
};
