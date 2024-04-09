"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogRequest = exports.getAllBlogRequests = exports.postBlogRequest = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const blogRequest_service_1 = require("../services/blogRequest.service");
const blogRequest_model_1 = __importDefault(require("../models/blogRequest.model"));
// upload blog request
exports.postBlogRequest = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        (0, blogRequest_service_1.createBlogRequest)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get all blog request
exports.getAllBlogRequests = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const blogRequests = await blogRequest_model_1.default.find();
        res.status(200).json({
            success: true,
            blogRequests,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// delete request -- only for admin
exports.deleteBlogRequest = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const request = await blogRequest_model_1.default.findById(id);
        if (!request) {
            return next(new ErrorHandler_1.default("Request not found", 404));
        }
        await request.deleteOne({ id });
        res.status(200).json({
            success: true,
            message: "Request deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
