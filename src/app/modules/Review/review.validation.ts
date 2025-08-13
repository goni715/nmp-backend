import { Types } from "mongoose";
import { z } from "zod";

export const createReviewValidationSchema = z.object({
  orderId: z
    .string({
      required_error: "orderId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "orderId must be a valid ObjectId",
    }),
  productId: z
    .string({
      required_error: "productId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "productId must be a valid ObjectId",
    }),
  star: z
    .number()
    .min(0.5, { message: "Rating must be at least 0" }) // Minimum rating is 0
    .max(5, { message: "Rating must not exceed 5" }) // Maximum rating is 5
    .refine((val) => val % 0.5 === 0, {
      message: "Rating must be in increments of 0.5",
    }),
  comment: z.string({
    required_error: "Comment is required",
  }),
});
