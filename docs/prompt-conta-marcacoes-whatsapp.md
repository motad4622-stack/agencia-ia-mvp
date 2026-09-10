# Prompt — conta obrigatória, marcações anónimas e WhatsApp

Especificação da próxima fase do site da **NextIA Marketing**
(`agencia-ia-mvp.vercel.app`). Escrito para ser lido de uma ponta à outra
antes de se mexer em código.

---

## 0. Ponto de partida

O que já existe hoje:

| Peça | Estado |
| --- | --- |
| Next.js 16 + Tailwind v4 + Prisma 6 sobre Postgres (Neon) | a funcionar |
| `/videos/marcar-reuniao` | mostra o Google Calendar embutido (`NEXT_PUBLIC_BOOKING_URL`) |
| `/sites-ia/contacto` | formulário de briefing → `WebsiteLead` |
| Modelos na BD | `MeetingRequest`, `WebsiteLead` — nada de utilizadores |
| Autenticação | nenhuma (o `/admin` usa só uma password única) |
| Emails | módulo pronto, mas o Resend ainda não está ligado |
| Contacto direto | não existe — nem telefone, nem WhatsApp |

---

## 1. Anonimato na marcação

### O problema, em concreto

A página de marcação embutida é do Google e mostra, em cima à esquerda,
**o nome e a fotografia do dono da agenda** — neste momento, `david mota`.
Também é o que aparece na pré-visualização quando se partilha o link:
a `og:image` do link é a fotografia de perfil da conta Google.

Isto não se resolve com código nosso. O iframe é de outro domínio: não
lhe conseguimos aplicar CSS, esconder elementos nem reescrever o
cabeçalho. O nome vem da conta Google que criou a agenda.

### As saídas possíveis

**A — Mudar o nome de exibição da conta Google (mais rápido).**
Em `myaccount.google.com` → Informações pessoais → Nome, passa a
`NextIA Marketing`, e a foto de perfil passa a ser o logótipo.
Zero código. **Atenção:** esse nome é o mesmo que aparece no Gmail e em
tudo o resto dessa conta.

**B — Conta Google só para o negócio (mais limpo).**
Criar uma conta nova (por exemplo `geral.nextiamarketing@gmail.com`) com
o nome `NextIA Marketing` e o logótipo, recriar lá a agenda de 30
minutos e trocar o `NEXT_PUBLIC_BOOKING_URL`. A conta pessoal deixa de
aparecer em lado nenhum. É preciso seres tu a criar a conta.

**C — Deixar cair o Google e usar agenda própria.**
`/videos/marcar-reuniao` deixa de ter iframe. Passa a ter um seletor de
horários nosso (dia + faixa horária + notas), que grava em
`MeetingRequest` e aparece no `/admin`. Não mostra nome nenhum, mas
perde-se a disponibilidade em tempo real: as confirmações passam a ser
manuais.

**Recomendação:** B. Mantém a agenda a sério e resolve o anonimato de
vez. A opção A serve se quiseres despachar isto hoje.

---

## 2. Conta obrigatória antes de marcar reunião

### Comportamento pedido

Sempre que alguém carrega em **Marcar reunião** — em qualquer sítio do
site: navbar, hero, cartões de serviço, CTA azul-escuro, rodapé — abre
uma **janela modal** com:

- **Continuar com Google** (um clique, é o caminho principal)
- **Criar conta** com nome, email e password
- **Entrar** para quem já tem conta
- link discreto para a política de privacidade

Só depois de autenticado é que a pessoa chega à agenda. Quem já tem
sessão iniciada salta a modal e vai direto.

### Implementação

- **Auth.js (NextAuth v5)** com adaptador Prisma sobre a Postgres que já
  existe.
  - *Google provider* — precisa de `GOOGLE_CLIENT_ID` e
    `GOOGLE_CLIENT_SECRET` (ver secção 5).
  - *Credentials provider* — email + password, com hash `bcrypt`
    (nunca em texto simples).
- **Prisma:** juntar `User`, `Account`, `Session` e `VerificationToken`
  (o esquema padrão do adaptador) e um campo `passwordHash` no `User`.
  Migração aplicada na Neon.
- **Rotas protegidas:** `/videos/marcar-reuniao` e
  `/sites-ia/contacto`. Middleware redireciona para
  `/entrar?next=<destino>` quem não tiver sessão — assim o link continua
  a funcionar mesmo que a modal falhe ou que a pessoa entre por um link
  direto.
- **Componente novo** `AuthGate` (client): intercepta os cliques nos
  botões de marcação, abre a modal e, no fim, encaminha para o destino.
  A modal fecha com `Esc`, com clique fora e devolve o foco ao botão de
  origem.
- **Ganho colateral:** a partir daqui sabemos quem marcou. O
  `MeetingRequest` passa a ter `userId`, o formulário já vem preenchido
  com o nome e o email, e o `/admin` mostra a conta associada a cada
  pedido.

### O que isto custa (e é decisão tua)

Obrigar a criar conta antes de falar convosco **corta contactos** — é
mais um passo entre o interesse e o pedido. Numa agência que ainda está
a construir carteira, costuma pesar. Duas formas de reduzir o estrago,
sem tirar nada do que pediste:

- Ter o **Google em destaque** e o email/password como alternativa
  secundária: um clique contra um formulário.
- Manter o **WhatsApp sempre visível** (secção 3) como via sem conta,
  para quem não quer registar-se.

Se preferires manter o gate à mesma, faço-o exatamente como está
descrito — é só dizeres.

### RGPD

Criar contas é tratar dados pessoais. Antes de isto ir para produção o
site precisa de:

- página `/privacidade` — que dados guardamos, para quê, durante quanto
  tempo, e como se pede a eliminação;
- caixa de consentimento explícita no registo por email;
- `/termos`, ainda que curtos.

Sem isto, o registo fica ilegal em Portugal. Escrevo os textos-base, mas
tens de os validar.

---

## 3. WhatsApp com mensagens pré-definidas

### Comportamento pedido

Botão flutuante de WhatsApp, sempre visível, para o número
**+351 910 961 434**. Ao carregar, a pessoa **não escreve o que quer**:
escolhe de uma lista curta e a mensagem segue já feita.

### O que é mesmo possível

Um link `wa.me` abre o WhatsApp com o texto **pré-preenchido na caixa de
escrita** — e a pessoa pode apagá-lo e escrever outra coisa antes de
enviar. Isso é o WhatsApp dela, no telemóvel dela; não há link, API nem
truque que o impeça. (A API do WhatsApp Business controla as mensagens
que a *empresa* envia, não as que o cliente escreve.)

O que se controla é **o nosso lado**, e é aí que a pessoa fica limitada:

1. Carrega no ícone → abre um painel com **4 opções**, e mais nada:
   - "Quero um vídeo para o meu alojamento"
   - "Quero um site com IA para a minha empresa"
   - "Quero saber preços"
   - "Tenho outra questão"
2. Escolhe uma → abrimos
   `https://wa.me/351910961434?text=<mensagem+codificada>` numa aba nova.
3. Cada opção leva também uma etiqueta de origem (ex.: `[site/videos]`),
   para saberes de que página veio.

Não há campo de texto livre em lado nenhum do nosso painel. É o mais
perto que dá para chegar do que pediste, e digo-o já para não haver
surpresa depois.

### Detalhes

- Componente `WhatsAppButton` (client), canto inferior direito, acima do
  rodapé, sem tapar CTAs em ecrã pequeno.
- Verde oficial `#25D366`, ícone em SVG, `aria-label` próprio, fecha com
  `Esc`.
- Número numa constante em `src/lib/brand.ts`
  (`WHATSAPP_NUMBER = "351910961434"`), para se mudar num sítio só.
- Aparece no site da agência. **Não** aparece no site-exemplo
  `/exemplos/casa-do-pinhal`, que tem o concierge próprio.

### Um aviso que liga isto ao ponto 1

Quem te mandar mensagem vê o **nome e a fotografia do teu perfil de
WhatsApp**. Se o objetivo é não seres reconhecido, o número tem de estar
num perfil **WhatsApp Business** com o nome `NextIA Marketing` e o
logótipo — senão o nome pessoal volta a aparecer, por outra porta.

---

## 4. Ordem de trabalho

1. WhatsApp (independente de tudo o resto, entra hoje)
2. Anonimato da agenda (opção A, B ou C — decisão tua)
3. Páginas `/privacidade` e `/termos`
4. Base de dados e Auth.js com email + password
5. Google como método de entrada (depende das credenciais)
6. Gate nos botões de marcação + middleware
7. Ligar `MeetingRequest` à conta e mostrar no `/admin`

---

## 5. O que preciso de ti

| # | O quê | Porquê |
| --- | --- | --- |
| 1 | Decidir A, B ou C para a agenda | muda o que se constrói |
| 2 | `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` (Google Cloud Console → OAuth 2.0, tipo *Web application*) | sem isto não há entrada com Google |
| 3 | Redirect URI a registar: `https://agencia-ia-mvp.vercel.app/api/auth/callback/google` e `http://localhost:3000/api/auth/callback/google` | exigência do Google |
| 4 | Confirmar o número: **910 961 434** | escrever mal um dígito manda contactos para um desconhecido |
| 5 | Perfil de WhatsApp Business com o nome da marca | senão o teu nome aparece na conversa |
| 6 | Validar os textos de `/privacidade` e `/termos` | responsabilidade legal é tua, não minha |

As credenciais do Google crias-as tu na tua conta — não as peço nem as
escrevo por ti. Quando as tiveres, ponho-as nas variáveis de ambiente do
Vercel.

---

## 6. Critérios de aceitação

- [ ] Nenhuma página do site mostra o nome pessoal do dono
- [ ] Todos os botões de marcação abrem a modal de conta a quem não tem sessão
- [ ] Entrar com Google funciona em produção
- [ ] Criar conta com email e password funciona, com password em hash
- [ ] Quem tem sessão vai direto à agenda, sem modal
- [ ] Aceder a `/videos/marcar-reuniao` sem sessão redireciona para `/entrar`
- [ ] O botão de WhatsApp abre 4 opções e nenhuma caixa de texto livre
- [ ] Cada opção abre o WhatsApp com a mensagem certa para o 910 961 434
- [ ] `/privacidade` e `/termos` existem e estão ligadas no rodapé e no registo
- [ ] `npx eslint .` limpo e `npm run build` a compilar
- [ ] Verificado em produção, em ecrã de telemóvel e de computador
