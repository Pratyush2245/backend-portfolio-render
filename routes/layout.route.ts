import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  createBlogLayout,
  createLayout,
  editBlogLayout,
  editLayout,
  getBlogLayout,
  getLayout,
} from "../controllers/layout.controller";
import { updateAccessToken } from "../controllers/user.controller";

const layoutRouter = express.Router();

layoutRouter.post(
  "/create-layout",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  createLayout
);

layoutRouter.put(
  "/edit-layout",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  editLayout
);

layoutRouter.get("/get-layout", getLayout);

layoutRouter.post(
  "/create-blog-layout",
  // updateAccessToken,
  // isAuthenticated,
  // authorizeRoles("admin"),
  createBlogLayout
);

layoutRouter.put(
  "/edit-blog-layout",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  editBlogLayout
);

layoutRouter.get("/get-blog-layout", getBlogLayout);

export default layoutRouter;
