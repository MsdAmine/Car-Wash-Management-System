export const API_URL = import.meta.env.VITE_API_URL;
export const APP_NAME = import.meta.env.VITE_APP_NAME;

if (import.meta.env.DEV) {
    console.log(`[Config] Connecting to: ${API_URL}`);
}