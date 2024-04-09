import { Response } from "express";

import { CatchAsyncError } from "../middleware/catchAsyncError";
import BlogRequestModal from "../models/blogRequest.model";

// create blog
export const createBlogRequest = CatchAsyncError(
  async (data: string, res: Response) => {
    const blogRequest = await BlogRequestModal.create(data);
    console.log(blogRequest);
    res.status(201).json({
      success: true,
      blogRequest,
    });
  }
);
