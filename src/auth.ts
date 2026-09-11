import NextAuth from "next-auth";
import { after } from "next/server";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notificarConta } from "@/lib/email";

/*
 * Contas de utilizador do site (nada a ver com o /admin, que continua a
 * ter a sua própria password).
 *
 * As sessões são JWT porque o Auth.js não permite login com password em
 * sessões de base de dados. O adaptador Prisma continua a servir para
 * guardar os utilizadores e as contas Google associadas.
 *
 * O Google só entra na lista de métodos se as credenciais existirem —
 * assim o site funciona na mesma enquanto elas não estiverem criadas.
 */

export const googleConfigurado = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

const credenciais = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/entrar", error: "/entrar" },
  providers: [
    ...(googleConfigurado
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: "Email e palavra-passe",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Palavra-passe", type: "password" },
      },
      async authorize(raw) {
        const parsed = credenciais.safeParse(raw);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const confere = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!confere) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  events: {
    // Só as contas criadas pelo adaptador passam aqui (Google). As de
    // palavra-passe são criadas em /api/auth/registar, que avisa por si.
    createUser({ user }) {
      if (user.id) {
        const id = user.id;
        after(() => notificarConta(id));
      }
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
