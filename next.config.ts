import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // A marcação deixou de ser só de vídeos: o endereço antigo continua a
      // funcionar e chega à agenda com o serviço já escolhido.
      {
        source: "/videos/marcar-reuniao",
        destination: "/marcar-reuniao?servico=videos",
        permanent: true,
      },
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
