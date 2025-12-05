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

const nextConfig: NextConfig = {
  /* config options here */
  headers: () => [
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
