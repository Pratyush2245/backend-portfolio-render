import mongoose, { Document, Model, Schema } from "mongoose";

interface IBlogRequest extends Document {
  email: string;
}

const blogRequestSchema = new Schema<IBlogRequest>(
  {
    email: String,
  },
  { timestamps: true }
);

const BlogRequestModal: Model<IBlogRequest> = mongoose.model(
  "BlogRequest",
  blogRequestSchema
);

export default BlogRequestModal;
