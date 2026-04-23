import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=()",
  },
];

const glbHeaders = [
  {
    key: "Content-Type",
    value: "model/gltf-binary",
  },
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
  {
    key: "Access-Control-Allow-Origin",
    value: "*",
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  headers: () => [
    ...["model", "model12", "model6", "mode1l"].map((modelName) => ({
      source: `/${modelName}.glb`,
      headers: glbHeaders,
    })),
    {
      source: "/:path*",
      headers: securityHeaders,
    },
    {
      source: "/api/:path*",
      headers: [
        ...securityHeaders,
        {
          key: "Cache-Control",
          value: "private, no-store, must-revalidate",
        },
      ],
    },
  ],
};

export default nextConfig;
