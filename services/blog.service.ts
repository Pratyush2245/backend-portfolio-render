import { Response } from "express";

import { CatchAsyncError } from "../middleware/catchAsyncError";
import BlogModal from "../models/blog.model";

// create blog
export const createBlog = CatchAsyncError(async (data: any, res: Response) => {
  const blog = await BlogModal.create(data);
  res.status(201).json({
    success: true,
    blog,
  });
});
