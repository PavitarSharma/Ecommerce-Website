import * as z from "zod";

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const LoginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email().trim(),
  password: z.string().min(1, { message: "Password is required" }).trim(),
  rememberMe: z.boolean(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email().trim(),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(passwordRegex, {
        message:
          "Password must be at least eight characters, at least one letter, one number and one special character",
      })
      .trim(),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match",
  });

export const OtpSchema = z.object({
  otp: z.string().min(1, { message: "Otp is required" }).trim(),
});

export const ChangePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(passwordRegex, {
        message:
          "Password must be at least eight characters, at least one letter, one number and one special character",
      })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match",
  });

export const RegisterSchema = z
  .object({
    name: z.string().min(1, { message: "Full name is required" }).trim(),
    email: z.string().min(1, { message: "Email is required" }).email().trim(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 6 characters" })
      .regex(passwordRegex, {
        message:
          "Password must be at least eight characters, at least one letter, one number and one special character",
      })
      .trim(),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match",
  });

export const EditProfileSchema = z.object({
  name: z.string().trim(),
  email: z.string().email().trim(),
  phone: z.string().trim(),
  bio: z.string().trim(),
  username: z.string().trim(),
});

export const AddressSchema = z.object({
  address: z
    .string()
    .min(1, { message: "Please enter a valid address" })
    .trim(),
  state: z.string().min(1, { message: "State is required" }).trim(),
  city: z.string().min(1, { message: "City is required" }).trim(),
  country: z.string().min(1, { message: "Country is required" }).trim(),
  zipcode: z.string().min(1, { message: "Zip code is required" }).trim(),
});

export const AddProductSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Product title is required",
      required_error: "Product title is required",
    })
    .min(5, { message: "Must be 5 or more characters long" })
    .trim(),
  category: z.object({
    label: z.string().min(1, { message: "Category label is required" }),
    value: z.string().min(1, { message: "Category value is required" }),
  }),
  description: z
    .string()
    .min(1, { message: "Product description is required" })
    .trim(),
  price: z.string().min(1, { message: "Product price is required" }).trim(),
  currency: z.string(),
  discountPrice: z.string().trim(),
  stock: z.string().min(1, { message: "Product stock is required" }).trim(),
  shippingPrice: z.string().trim(),
  sku: z.string().trim(),
  quality: z.string().trim(),
  // quality: z.object({
  //   label: z.string().min(1, { message: "Category label is required" }),
  //   value: z.string().min(1, { message: "Category value is required" }),
  // }),
  barcode: z.string().trim(),
  sizes: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .min(1, { message: "Size is required" }),
});

export const AddProductColorSchema = z.object({
  color: z.string().trim(),
});

export const ShippingInformationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).trim(),
  address: z.string().min(1, { message: "Address is required" }).trim(),
  city: z.string().min(1, { message: "City is required" }).trim(),
  state: z.string().min(1, { message: "State is required" }).trim(),
  zipcode: z.string().min(1, { message: "Zip is required" }).trim(),
  country: z.string().min(1, { message: "Country is required" }).trim(),
  phone: z.string().min(1, { message: "Phone is required" }).trim(),
  email: z.string().min(1, { message: "Email is required" }).trim(),
});

export const PaymentCardInformationSchema = z.object({
  cardHolder: z
    .string()
    .min(1, { message: "Card holder name is required" })
    .trim(),
  cardNumber: z
    .string()
    .min(1, { message: "Card number required" })
    .max(12, { message: "Maximum length reached" })
    .trim(),
  expiry: z.string().min(1, { message: "Expiry date is required" }).trim(),
  cvv: z
    .string()
    .min(1, { message: "Card cvv is required" })
    .max(12, { message: "Maximum length reached" })
    .trim(),
});

export const ContactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).trim(),
  email: z.string().min(1, { message: "Email is required" }).trim(),
  message: z.string().min(1, { message: "Message is required" }).trim(),
  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone is required" })
    .max(15, { message: "Phone number cannot exceed 15 characters" })
    .regex(/^\d+$/, { message: "Phone number must contain only numbers" })
    .trim(),
});

export const ReviewSchema = z.object({
  rating: z.number().min(1, { message: "Rating is required" }),
  message: z.string().min(1, { message: "Review is required" }).trim(),
});
