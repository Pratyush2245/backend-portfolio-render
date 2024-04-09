import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import cloudinary from "cloudinary";
import { redis } from "../utils/redis";
import BlogModal from "../models/blog.model";
import { createBlog } from "../services/blog.service";
import { createBlogRequest } from "../services/blogRequest.service";
import BlogRequestModal from "../models/blogRequest.model";

// upload blog request
export const postBlogRequest = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      createBlogRequest(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all blog request
export const getAllBlogRequests = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogRequests = await BlogRequestModal.find();
      res.status(200).json({
        success: true,
        blogRequests,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// delete request -- only for admin
export const deleteBlogRequest = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const request = await BlogRequestModal.findById(id);
      if (!request) {
        return next(new ErrorHandler("Request not found", 404));
      }
      await request.deleteOne({ id });

      res.status(200).json({
        success: true,
        message: "Request deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
