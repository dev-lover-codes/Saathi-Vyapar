import type { NextConfig } from "next";

// Files the OCR worker needs at runtime (see outputFileTracingIncludes below).
const OCR_RUNTIME_FILES = [
  './tessdata/**/*',
  './node_modules/tesseract.js/src/**/*',
  './node_modules/tesseract.js-core/**/*',
  './node_modules/bmp-js/**/*',
  './node_modules/wasm-feature-detect/**/*',
  './node_modules/is-url/**/*',
  './node_modules/idb-keyval/**/*',
  './node_modules/regenerator-runtime/**/*',
  './node_modules/zlibjs/**/*',
  './node_modules/node-fetch/**/*',
  './node_modules/whatwg-url/**/*',
  './node_modules/tr46/**/*',
  './node_modules/webidl-conversions/**/*',
];

const nextConfig: NextConfig = {
  // Set STANDALONE_BUILD=1 to emit .next/standalone (mirrors what Vercel deploys).
  ...(process.env.STANDALONE_BUILD ? { output: 'standalone' as const } : {}),
  // Tesseract spawns a worker by resolving a path inside its own package at
  // runtime. Bundling it rewrites that path to /ROOT/node_modules/... which
  // does not exist once the route is running, so every photo upload threw
  // "Cannot find module .../worker-script/node/index.js" and took the server
  // down with an uncaughtException. Leaving the package external keeps the
  // real path intact. This only shows up inside Next — the same code runs
  // fine in a plain Node script, which is how it got missed.
  serverExternalPackages: ['tesseract.js'],

  // Ship everything OCR needs inside each function that can run it. The
  // tesseract worker thread is spawned by file path and does its own
  // require()s at runtime (WASM core variant chosen after SIMD detection,
  // image decoders, fetch polyfill), none of which the file tracer can
  // follow from the route. Verified with an isolated `output: 'standalone'`
  // build: a missing module kills the worker, recognize() never settles and
  // the request 504s at maxDuration — exactly what happened on Vercel.
  outputFileTracingIncludes: {
    '/api/ledger/ocr': OCR_RUNTIME_FILES,
    '/api/whatsapp/webhook': OCR_RUNTIME_FILES,
  },

  async redirects() {
    return [
      {
        source: '/signup',
        destination: '/login',
        permanent: false,
      },
      {
        source: '/register',
        destination: '/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
