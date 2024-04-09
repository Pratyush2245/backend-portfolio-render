import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import {
  deleteBlogRequest,
  getAllBlogRequests,
  postBlogRequest,
} from "../controllers/blogRequest.controller";

const blogRequestRouter = express.Router();

blogRequestRouter.post(
  "/create-blog-request",
  updateAccessToken,
  isAuthenticated,
  postBlogRequest
);

blogRequestRouter.get(
  "/get-all-blog-requests",
  updateAccessToken,
  isAuthenticated,
  getAllBlogRequests
);

blogRequestRouter.delete(
  "/delete-blog-request/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  deleteBlogRequest
);

export default blogRequestRouter;
