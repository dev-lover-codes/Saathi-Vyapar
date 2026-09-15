import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tesseract spawns a worker by resolving a path inside its own package at
  // runtime. Bundling it rewrites that path to /ROOT/node_modules/... which
  // does not exist once the route is running, so every photo upload threw
  // "Cannot find module .../worker-script/node/index.js" and took the server
  // down with an uncaughtException. Leaving the package external keeps the
  // real path intact. This only shows up inside Next — the same code runs
  // fine in a plain Node script, which is how it got missed.
  serverExternalPackages: ['tesseract.js'],

  // Ship everything OCR needs inside each function that can run it:
  //  - ./tessdata — the committed eng/hin language packs (no runtime download)
  //  - tesseract.js-core — the WASM engine. The worker picks a variant at
  //    runtime (SIMD / relaxed-SIMD / plain) via a conditional require, which
  //    the file tracer cannot follow; without this the worker thread dies on
  //    Vercel, recognize() never settles and the request 504s.
  //  - tesseract.js/src — the worker script the main thread spawns by path.
  outputFileTracingIncludes: {
    '/api/ledger/ocr': [
      './tessdata/**/*',
      './node_modules/tesseract.js-core/**/*',
      './node_modules/tesseract.js/src/**/*',
    ],
    '/api/whatsapp/webhook': [
      './tessdata/**/*',
      './node_modules/tesseract.js-core/**/*',
      './node_modules/tesseract.js/src/**/*',
    ],
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
