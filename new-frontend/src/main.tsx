import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import * as Sentry from "@sentry/react";
// Sentry Setup
Sentry.init({
  dsn: "https://c17e68a8b8855d05711edded10a64543@o4508009410854912.ingest.us.sentry.io/4508241583013888",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.extraErrorDataIntegration(),
  ],
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/qtozlukrkvmcjdfkrstp.supabase.co/,
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const root = document.getElementById("root");
createRoot(root!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
