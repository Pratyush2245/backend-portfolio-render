import { Response } from "express";

import { CatchAsyncError } from "../middleware/catchAsyncError";
import BlogRequestModal from "../models/blogRequest.model";

// create blog
export const createBlogRequest = CatchAsyncError(
  async (data: any, res: Response) => {
    const userEmail = data.email;
    const blogRequest = await BlogRequestModal.create(userEmail);
    console.log(blogRequest);
    res.status(201).json({
      success: true,
      blogRequest,
    });
  }
);
