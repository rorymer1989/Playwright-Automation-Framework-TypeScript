/**
 * @typedef {Object} EnvironmentConfig
 * @property {string} baseUrl
 * @property {string} environment
 */

export const ENV = {
  baseUrl: process.env.BASE_URL ?? "",
  environment: process.env.TEST_ENV ?? "UAT",
};