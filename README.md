# NextIA Marketing — MVP

Site de uma agência com dois serviços:

1. **Vídeos de IA para Alojamento** — anfitriões marcam uma reunião,
   partilham as fotos do imóvel, e a equipa produz manualmente (com apoio
   de IA) um vídeo walkthrough cinematográfico.
2. **Sites com IA para Empresas** — captação de leads via formulário de
   briefing, com email automático de confirmação.

Stack: Next.js (App Router) + TypeScript + Tailwind CSS + Prisma/SQLite +
Resend (emails) + agenda do Google Calendar/Calendly embutida (ou
formulário de fallback).

**Tudo corre em modo mock por omissão** — não precisas de nenhuma chave de
API real para testar o site de ponta a ponta.

---

## 1. Correr o projeto localmente

```bash
npm install
npx prisma migrate deploy   # cria/atualiza a base de dados SQLite (prisma/dev.db)
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

O `.env` já vem pré-preenchido (copiado de `.env.example`) com tudo vazio
exceto `ADMIN_PASSWORD="muda-me"` — não precisas de mexer em nada para
testar o MVP.

---

## 2. Testar o fluxo de vídeos (marcar reunião → email)

O vídeo em si **não é gerado no site**: a IA para o vídeo é usada pela
equipa manualmente depois da reunião. O site trata só de captar o pedido.

1. Vai a **`/videos/marcar-reuniao`**.
2. Sem `NEXT_PUBLIC_BOOKING_URL` definida no `.env` (default), vês um
   **formulário de fallback**: nome, email, telefone, imóvel, tipo de
   alojamento e mensagem.
3. Preenche e clica em **"Pedir reunião"**.
4. És redirecionado para `/videos/marcar-reuniao/sucesso`.
5. O pedido fica gravado na base de dados (`MeetingRequest`) e disponível
   no admin. O email de confirmação é escrito em `logs/emails.log` (ou
   enviado a sério, se `RESEND_API_KEY` estiver definida).

### Ligar uma agenda real (Google Calendar ou Calendly)

A forma recomendada é uma **"Appointment schedule"** do Google Calendar
(equivalente nativo ao Calendly, sem conta de terceiros):

1. Em [calendar.google.com](https://calendar.google.com): **Criar** →
   **Agenda de marcações** → define duração/disponibilidade → **Guardar**.
2. Copia o link de partilha (ex.: `https://calendar.app.google/xxxxx`).
3. Define no `.env`:

```
NEXT_PUBLIC_BOOKING_URL="https://calendar.app.google/xxxxx"
```

Reinicia o `npm run dev` — a página `/videos/marcar-reuniao` passa a
mostrar o calendário embutido em vez do formulário de fallback. Também
aceita um link do Calendly (`https://calendly.com/...`) na mesma
variável — o componente [`BookingEmbed`](src/components/BookingEmbed.tsx)
deteta automaticamente qual dos dois é, pelo próprio URL.

---

## 3. Testar o fluxo de sites com IA (briefing → lead → email)

1. Vai a **`/sites-ia/contacto`**.
2. Preenche o formulário (nome, email, empresa, tipo de negócio, o que
   pretende integrar, orçamento, mensagem).
3. Clica em **"Enviar pedido"**.
4. És redirecionado para `/sites-ia/contacto/sucesso`.
5. O lead fica gravado na base de dados e disponível no admin. O email de
   confirmação + agradecimento é escrito em `logs/emails.log` (ou enviado
   a sério, se `RESEND_API_KEY` estiver definida).

---

## 4. Painel de administração

Vai a **`/admin`** e entra com a password de `ADMIN_PASSWORD` (default:
`muda-me`, definida no `.env`).

- **Pedidos de Reunião — Vídeos** — lista todos os pedidos com estado,
  cliente, imóvel e mensagem. Muda o estado (`novo` → `em contacto` →
  `fechado`) diretamente no dropdown de cada linha.
- **Leads de Sites com IA** — o mesmo, para os leads do formulário de
  briefing.

---

## 5. Ligar as chaves reais (quando quiseres sair do modo mock)

Tudo o que precisas de mudar está no `.env` — nenhum outro ficheiro tem
de ser alterado para a app passar a usar serviços reais:

| O quê | Variável | Onde muda o comportamento |
|---|---|---|
| Agenda de reuniões | `NEXT_PUBLIC_BOOKING_URL` | [`src/app/videos/marcar-reuniao/page.tsx`](src/app/videos/marcar-reuniao/page.tsx), [`src/components/BookingEmbed.tsx`](src/components/BookingEmbed.tsx) |
| Emails | `RESEND_API_KEY` + `EMAIL_FROM` | [`src/lib/email.ts`](src/lib/email.ts) |
| Base de dados de produção | trocar `provider = "sqlite"` para `"postgresql"` em `prisma/schema.prisma` e apontar `DATABASE_URL` para o Postgres/Supabase | [`prisma/schema.prisma`](prisma/schema.prisma) |
| Logótipo real | troca o componente `Logo` por um `<Image src="/logo.png" .../>` | [`src/components/Logo.tsx`](src/components/Logo.tsx) |

O preço de referência do vídeo (49€ por omissão) é uma constante única em
[`src/lib/brand.ts`](src/lib/brand.ts) (`VIDEO_PRICE_EUR`).

---

## 6. Estrutura do projeto

```
prisma/schema.prisma          Modelos MeetingRequest e WebsiteLead
src/lib/
  brand.ts                    Nome da marca, preço de referência, link da agenda
  email.ts                    3 templates de email + modo mock/log
  auth.ts                     Autenticação simples do admin (password única)
  prisma.ts                   Cliente Prisma singleton
src/components/
  Logo.tsx                    Logótipo (SVG placeholder — trocar pelo ficheiro real)
  Nav.tsx / Footer.tsx        Navegação e rodapé
  BookingEmbed.tsx             Agenda embutida (Google Calendar ou Calendly)
  MeetingRequestForm.tsx      Formulário de fallback (sem agenda ligada)
src/app/
  page.tsx                    Landing page
  videos/                     Página de serviço + marcar-reuniao + sucesso
  sites-ia/                   Página de serviço, formulário de briefing
  admin/                      Login + dashboard com 2 separadores
  api/                        Rotas de backend (pedidos, leads, admin)
```

---

## 7. Fora de âmbito deste MVP

Geração automática do vídeo no site (feita manualmente pela equipa), app
mobile, edição manual do vídeo dentro do site, geração automática de
propostas/orçamentos para sites com IA, múltiplos idiomas, faturação
automática/contabilidade, marketplace de editores, integração direta com
a API do Airbnb, CRM completo.
