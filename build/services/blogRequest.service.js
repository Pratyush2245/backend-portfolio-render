"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlogRequest = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const blogRequest_model_1 = __importDefault(require("../models/blogRequest.model"));
// create blog
exports.createBlogRequest = (0, catchAsyncError_1.CatchAsyncError)(async (data, res) => {
    const userEmail = data.email;
    const blogRequest = await blogRequest_model_1.default.create(userEmail);
    console.log(blogRequest);
    res.status(201).json({
        success: true,
        blogRequest,
    });
});
