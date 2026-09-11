import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Um só endereço canónico: o www reencaminha para o domínio principal,
      // para os motores de busca não verem o site em duplicado.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nextiamarketing.website" }],
        destination: "https://nextiamarketing.website/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
