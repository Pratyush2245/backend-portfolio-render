import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import {
  addReplyToReview,
  addReview,
  deleteBlog,
  editBlog,
  getAllBlogs,
  uploadBlog,
} from "../controllers/blog.controller";

const blogRouter = express.Router();

blogRouter.post(
  "/create-blog",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "writer"),
  uploadBlog
);

blogRouter.put(
  "/edit-blog/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "writer"),
  editBlog
);

blogRouter.get("/get-blogs", getAllBlogs);

blogRouter.put(
  "/add-blog-review/:id",
  updateAccessToken,
  isAuthenticated,
  addReview
);

blogRouter.put(
  "/add-blog-reply",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "writer"),
  addReplyToReview
);

blogRouter.delete(
  "/delete-blog/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "writer"),
  deleteBlog
);

export default blogRouter;
