"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlog = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const blog_model_1 = __importDefault(require("../models/blog.model"));
// create blog
exports.createBlog = (0, catchAsyncError_1.CatchAsyncError)(async (data, res) => {
    const blog = await blog_model_1.default.create(data);
    res.status(201).json({
        success: true,
        blog,
    });
});
