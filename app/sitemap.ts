// app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Ha van külön oldalad, ide vedd fel:
    // { url: `${BASE}/adoazonosito`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];

  return routes;
}
