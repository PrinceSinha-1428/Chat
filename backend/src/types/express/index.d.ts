import type User from "@models/user.model"; // import your User model type

declare global {
  namespace Express {
    interface Request {
      user?: InstanceType<typeof User>; // req.user will now be typed as a Mongoose User instance
    }
  }
}
