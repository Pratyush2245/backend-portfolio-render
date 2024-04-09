import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import cloudinary from "cloudinary";
import { redis } from "../utils/redis";
import BlogModal from "../models/blog.model";
import { createBlog } from "../services/blog.service";

// upload blog
export const uploadBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.blogThumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "blogs",
        });

        data.blogThumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createBlog(data, res, next);

      // updating redis database too
      const allBlogs = await BlogModal.find();
      await redis.set("allBlogs", JSON.stringify(allBlogs));
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit blog
export const editBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data?.blogThumbnail;
      const blogId = req.params.id;

      const blogData = (await BlogModal.findById(blogId)) as any;

      if (thumbnail && !thumbnail.startsWith("https")) {
        if (blogData?.blogThumbnail?.public_id) {
          await cloudinary.v2.uploader.destroy(
            blogData?.blogThumbnail?.public_id
          );
        }
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "blogs",
        });

        data.blogThumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (thumbnail.startsWith("https")) {
        data.blogThumbnail = {
          public_id: blogData?.blogThumbnail.public_id,
          url: blogData?.blogThumbnail.url,
        };
      }

      const blog = await BlogModal.findByIdAndUpdate(
        blogId,
        {
          $set: data,
        },
        { new: true }
      );

      // updating redis database too
      const blogDetails = await BlogModal.findById(blogId);
      await redis.set(blogId, JSON.stringify(blogDetails));

      res.status(201).json({
        success: true,
        blog,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all blogs
export const getAllBlogs = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const isCacheExist = await redis.get("allBlogs");
      // if (isCacheExist) {
      //   const blogs = JSON.parse(isCacheExist);
      //   res.status(200).json({
      //     success: true,
      //     blogs,
      //   });
      // } else {
      const blogs = await BlogModal.find();
      await redis.set("allBlogs", JSON.stringify(blogs));
      res.status(200).json({
        success: true,
        blogs,
      });
      // }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Add Review in blog
interface IReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogId = req.params.id;

      const blog = await BlogModal.findById(blogId);
      const { review, rating } = req.body as IReviewData;
      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };

      blog?.reviews.push(reviewData);

      let total = 0;

      blog?.reviews.forEach((review: any) => {
        total += review.rating;
      });

      if (blog) {
        blog.ratings = total / blog.reviews.length;
      }

      await blog?.save();

      // Retrieve allBlogs data from Redis
      const allBlogsString = await redis.get("allBlogs");
      if (!allBlogsString) {
        throw new Error("allBlogs data not found in Redis");
      }

      const allBlogs = JSON.parse(allBlogsString);

      // Find and update the specific project within allBlogs
      const updatedAllBlogs = allBlogs.map((b: any) => {
        if (b._id.toString() === blogId) {
          // Update the project with the new data
          b.reviews.push(reviewData);
          b.ratings = total / b.reviews.length;
        }
        return b;
      });

      // Set the updated allBlogs data back to Redis
      await redis.set(
        "allBlogs",
        JSON.stringify(updatedAllBlogs),
        "EX",
        604800
      );

      res.status(200).json({
        success: true,
        blog,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Add reply in review
interface IAddReviewData {
  comment: string;
  blogId: string;
  reviewId: string;
}

export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, blogId, reviewId } = req.body as IAddReviewData;

      const blog = await BlogModal.findById(blogId);

      if (!blog) {
        return next(new ErrorHandler("Blog not found!", 404));
      }

      const review = blog?.reviews?.find(
        (review) => review._id.toString() === reviewId
      );

      if (!review) {
        return next(new ErrorHandler("Review not found!", 404));
      }

      const replyData: any = {
        user: req.user,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies?.push(replyData);

      await blog.save();

      // Retrieve allBlogs data from Redis
      const allBlogsString = await redis.get("allBlogs");
      if (!allBlogsString) {
        throw new Error("allBlogs data not found in Redis");
      }

      const allBlogs = JSON.parse(allBlogsString);

      // Find and update the specific project within allBlogs
      const updatedAllBlogs = allBlogs.map((blog: any) => {
        if (blog._id === blogId) {
          blog.reviews.map((review: any) => {
            if (review._id === reviewId) {
              if (!review.commentReplies) {
                review.commentReplies = [];
              }
              review.commentReplies?.push(replyData);
            }
          });
        }
        return blog;
      });

      // Set the updated allBlogs data back to Redis
      await redis.set(
        "allBlogs",
        JSON.stringify(updatedAllBlogs),
        "EX",
        604800
      );

      await redis.set(blogId, JSON.stringify(blog), "EX", 604800);

      res.status(200).json({
        success: true,
        blog,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// delete blog -- only for admin and writer
export const deleteBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const blog = await BlogModal.findById(id);
      if (!blog) {
        return next(new ErrorHandler("Blog not found", 404));
      }
      await blog.deleteOne({ id });
      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
