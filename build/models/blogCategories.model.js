"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    title: {
        type: String,
    },
});
const layoutSchema = new mongoose_1.Schema({
    categories: [categorySchema],
});
const BlogCatModal = (0, mongoose_1.model)("BlogCategory", layoutSchema);
exports.default = BlogCatModal;
