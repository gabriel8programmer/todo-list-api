declare namespace Express {
  interface Request {
    user?: {
      id?: string
      name?: string
      email?: string
      role?: 'ADMIN' | 'CLIENT'
      isWithGoogle?: boolean
      isWithFacebook?: boolean
      emailVerified?: boolean
    }
  }
}
