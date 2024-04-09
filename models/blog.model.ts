import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies?: IComment[];
}

interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface IBlog extends Document {
  title: string;
  description: string;
  blogThumbnail: object;
  links: ILink[];
  tags: string;
  categories: string;
  reviews: IReview[];
  ratings?: number;
  user: IUser;
}

const reviewSchema = new Schema<IReview>(
  {
    user: Object,
    rating: {
      type: Number,
      default: 0,
    },
    comment: String,
    commentReplies: [Object],
  },
  { timestamps: true }
);

const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    blogThumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    links: [linkSchema],
    tags: {
      type: String,
      required: true,
    },
    categories: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    reviews: [reviewSchema],
    ratings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const BlogModal: Model<IBlog> = mongoose.model("Blog", blogSchema);

export default BlogModal;
