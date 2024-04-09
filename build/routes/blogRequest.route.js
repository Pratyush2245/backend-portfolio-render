"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user.controller");
const blogRequest_controller_1 = require("../controllers/blogRequest.controller");
const blogRequestRouter = express_1.default.Router();
blogRequestRouter.post("/create-blog-request", user_controller_1.updateAccessToken, auth_1.isAuthenticated, blogRequest_controller_1.postBlogRequest);
blogRequestRouter.get("/get-all-blog-requests", user_controller_1.updateAccessToken, auth_1.isAuthenticated, blogRequest_controller_1.getAllBlogRequests);
blogRequestRouter.delete("/delete-blog-request/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), blogRequest_controller_1.deleteBlogRequest);
exports.default = blogRequestRouter;
