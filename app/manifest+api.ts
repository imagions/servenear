export function GET() {
  const manifest = {
    name: "ServeNear - Local Service Marketplace",
    short_name: "ServeNear",
    description: "Connect with trusted local service providers in your area",
    start_url: "/",
    display: "standalone",
    background_color: "#F0FCFF",
    theme_color: "#00CFE8",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icon-512.png", 
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    categories: ["business", "productivity", "utilities"],
    lang: "en-US",
    dir: "ltr"
  };

  return Response.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  });
}