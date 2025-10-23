/**
 * JWT Configuration
 * 
 * Architectural Decision: Centralized JWT configuration
 * Trade-off: Using environment variables for secrets provides
 * flexibility across environments while maintaining security.
 */

export const jwtConfig = {
  secret: process.env.JWT_SECRET || "cleancity-dev-secret-key-change-in-production",
  expiresIn: "7d", // Token expires in 7 days
};
