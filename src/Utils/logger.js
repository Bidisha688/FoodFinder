const isProd = process.env.NODE_ENV === "production";

// Only escalate to console.error in production (so the dev overlay stays quiet)
export function logRequestError(...args) {
  if (isProd) {
    // keep error-level for prod observability
    // eslint-disable-next-line no-console
    console.error(...args);
  } else {
    // eslint-disable-next-line no-console
    console.warn(...args);
  }
}

// Whatever else you want:
export function logDebug(...args) {
  if (!isProd) {
    // eslint-disable-next-line no-console
    console.debug(...args);
  }
}
