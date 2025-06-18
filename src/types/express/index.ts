declare namespace Express {
  interface Request {
    user?: {
      id?: string
      email?: string
      role?: 'ADMIN' | 'CLIENT'
      isWithGoogle?: boolean
      isWithFacebook?: boolean
    }
  }
}
