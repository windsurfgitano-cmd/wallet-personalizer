import { createRequestHandler } from "@shopify/remix/server";
import * as build from "@remix-run/dev/server-build";

export default {
  dev: {
    port: 3000,
  },
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
  },
};

export const handleRequest = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});
