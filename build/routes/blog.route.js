"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user.controller");
const blog_controller_1 = require("../controllers/blog.controller");
const blogRouter = express_1.default.Router();
blogRouter.post("/create-blog", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "writer"), blog_controller_1.uploadBlog);
blogRouter.put("/edit-blog/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "writer"), blog_controller_1.editBlog);
blogRouter.get("/get-blogs", blog_controller_1.getAllBlogs);
blogRouter.put("/add-blog-review/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, blog_controller_1.addReview);
blogRouter.put("/add-blog-reply", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "writer"), blog_controller_1.addReplyToReview);
blogRouter.delete("/delete-blog/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin", "writer"), blog_controller_1.deleteBlog);
exports.default = blogRouter;
