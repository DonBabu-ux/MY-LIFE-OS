/**
 * Root Jest config — multi-project.
 * Each workspace has its own test setup; this file orchestrates them.
 */
module.exports = {
  projects: [
    "<rootDir>/app",
    "<rootDir>/server",
    "<rootDir>/shared",
  ],
};
