import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import LayoutModal from "../models/layout.model";
import BlogCatModal from "../models/blogCategories.model";

// create layout
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categories } = req.body;

      const catergoryItems = await Promise.all(
        categories.map(async (category: any) => {
          return {
            title: category.title,
          };
        })
      );
      await LayoutModal.create({
        categories: catergoryItems,
      });

      res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categories } = req.body;

      const catergoryItems = await Promise.all(
        categories.map(async (category: any) => {
          return {
            title: category.title,
          };
        })
      );
      await LayoutModal.findByIdAndUpdate({
        categories: catergoryItems,
      });

      res.status(200).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get layout
export const getLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const layout = await LayoutModal.find();
      res.status(201).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// create layout
export const createBlogLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categories } = req.body;

      const catergoryItems = await Promise.all(
        categories.map(async (category: any) => {
          return {
            title: category.title,
          };
        })
      );
      await BlogCatModal.create({
        categories: catergoryItems,
      });

      res.status(200).json({
        success: true,
        message: "Category created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit layout
export const editBlogLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categories } = req.body;

      const catergoryItems = await Promise.all(
        categories.map(async (category: any) => {
          return {
            title: category.title,
          };
        })
      );
      await BlogCatModal.findByIdAndUpdate({
        categories: catergoryItems,
      });

      res.status(200).json({
        success: true,
        message: "Category updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get layout
export const getBlogLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await BlogCatModal.find();
      res.status(201).json({
        success: true,
        categories,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
