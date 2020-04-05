const urlParams = new URLSearchParams(window.location.search);

let env = urlParams.get("env");

if (!env || ["development", "test", "production"].indexOf(env) === -1) {
  env = process.env.NODE_ENV;
}

export const isDevelopment = env === "development";
export const isTest = env === "test";
export const isProduction = env === "production";
