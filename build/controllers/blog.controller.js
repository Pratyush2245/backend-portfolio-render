"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.addReplyToReview = exports.addReview = exports.getAllBlogs = exports.editBlog = exports.uploadBlog = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const cloudinary_1 = __importDefault(require("cloudinary"));
const redis_1 = require("../utils/redis");
const blog_model_1 = __importDefault(require("../models/blog.model"));
const blog_service_1 = require("../services/blog.service");
// upload blog
exports.uploadBlog = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.blogThumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "blogs",
            });
            data.blogThumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        (0, blog_service_1.createBlog)(data, res, next);
        // updating redis database too
        const allBlogs = await blog_model_1.default.find();
        await redis_1.redis.set("allBlogs", JSON.stringify(allBlogs));
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// edit blog
exports.editBlog = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data?.blogThumbnail;
        const blogId = req.params.id;
        const blogData = (await blog_model_1.default.findById(blogId));
        if (thumbnail && !thumbnail.startsWith("https")) {
            await cloudinary_1.default.v2.uploader.destroy(blogData?.blogThumbnail?.public_id);
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
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
        const blog = await blog_model_1.default.findByIdAndUpdate(blogId, {
            $set: data,
        }, { new: true });
        // updating redis database too
        const blogDetails = await blog_model_1.default.findById(blogId);
        await redis_1.redis.set(blogId, JSON.stringify(blogDetails));
        res.status(201).json({
            success: true,
            blog,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get all blogs
exports.getAllBlogs = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // const isCacheExist = await redis.get("allBlogs");
        // if (isCacheExist) {
        //   const blogs = JSON.parse(isCacheExist);
        //   res.status(200).json({
        //     success: true,
        //     blogs,
        //   });
        // } else {
        const blogs = await blog_model_1.default.find();
        await redis_1.redis.set("allBlogs", JSON.stringify(blogs));
        res.status(200).json({
            success: true,
            blogs,
        });
        // }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addReview = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const blog = await blog_model_1.default.findById(blogId);
        const { review, rating } = req.body;
        const reviewData = {
            user: req.user,
            comment: review,
            rating,
        };
        blog?.reviews.push(reviewData);
        let total = 0;
        blog?.reviews.forEach((review) => {
            total += review.rating;
        });
        if (blog) {
            blog.ratings = total / blog.reviews.length;
        }
        await blog?.save();
        // Retrieve allBlogs data from Redis
        const allBlogsString = await redis_1.redis.get("allBlogs");
        if (!allBlogsString) {
            throw new Error("allBlogs data not found in Redis");
        }
        const allBlogs = JSON.parse(allBlogsString);
        // Find and update the specific project within allBlogs
        const updatedAllBlogs = allBlogs.map((b) => {
            if (b._id.toString() === blogId) {
                // Update the project with the new data
                b.reviews.push(reviewData);
                b.ratings = total / b.reviews.length;
            }
            return b;
        });
        // Set the updated allBlogs data back to Redis
        await redis_1.redis.set("allBlogs", JSON.stringify(updatedAllBlogs), "EX", 604800);
        res.status(200).json({
            success: true,
            blog,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addReplyToReview = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { comment, blogId, reviewId } = req.body;
        const blog = await blog_model_1.default.findById(blogId);
        if (!blog) {
            return next(new ErrorHandler_1.default("Blog not found!", 404));
        }
        const review = blog?.reviews?.find((review) => review._id.toString() === reviewId);
        if (!review) {
            return next(new ErrorHandler_1.default("Review not found!", 404));
        }
        const replyData = {
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
        const allBlogsString = await redis_1.redis.get("allBlogs");
        if (!allBlogsString) {
            throw new Error("allBlogs data not found in Redis");
        }
        const allBlogs = JSON.parse(allBlogsString);
        // Find and update the specific project within allBlogs
        const updatedAllBlogs = allBlogs.map((blog) => {
            if (blog._id === blogId) {
                blog.reviews.map((review) => {
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
        await redis_1.redis.set("allBlogs", JSON.stringify(updatedAllBlogs), "EX", 604800);
        await redis_1.redis.set(blogId, JSON.stringify(blog), "EX", 604800);
        res.status(200).json({
            success: true,
            blog,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// delete blog -- only for admin and writer
exports.deleteBlog = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const blog = await blog_model_1.default.findById(id);
        if (!blog) {
            return next(new ErrorHandler_1.default("Blog not found", 404));
        }
        await blog.deleteOne({ id });
        await redis_1.redis.del(id);
        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
