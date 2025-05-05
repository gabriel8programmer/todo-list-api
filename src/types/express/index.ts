declare namespace Express {
  interface Request {
    user?: {
      name?: string;
      email?: string;
      role?: "ADMIN" | "CLIENT";
      isWithGoogle?: boolean;
      isWithFacebook?: boolean;
    };
  }
}
