# Prompt — agendamento próprio e emails no tema da marca

Substituir a agenda do Google por um sistema de marcações nosso, e pôr
o site a mandar emails a sério — detalhados, no tema da **NextIA
Marketing**, com tudo a cair em `nextvisionia1@gmail.com`.

Referência de estrutura (não de estilo): o email de confirmação do
washandclean.github.io — cabeçalho colorido, saudação, secções com
título e ícone, linhas separadoras, botão de ação, total em destaque.
Copiamos a **arrumação da informação**, não as cores nem os textos.

---

## 0. Ponto de partida

| Peça | Estado hoje |
| --- | --- |
| Marcação | iframe do Google Calendar (`NEXT_PUBLIC_BOOKING_URL`) |
| Formulário próprio | existe, mas só aparece se o link do Google estiver vazio |
| Emails ao cliente | dois modelos escritos, mas **não saem** |
| Emails ao administrador | **não existem** |
| Email na criação de conta | não existe |
| Resend | `RESEND_API_KEY` vazia |

O ponto mais importante: **hoje não sai um único email do site.** Sem
chave do Resend, o módulo escreve em `logs/emails.log` — e no Vercel o
disco é só de leitura, por isso nem o ficheiro fica. Tudo o que está
abaixo depende de resolver isto (secção 3).

---

## 1. Agendamento próprio

### Percurso do visitante

1. Carrega em **Marcar reunião** → cria conta ou entra (já feito)
2. Escolhe o **serviço**: Vídeos de alojamento ou Site com IA
3. Vê um **calendário** com os dias disponíveis e escolhe um
4. Vê as **horas livres** desse dia e escolhe uma
5. Preenche o que falta — imóvel ou empresa, telefone, mensagem — já com
   o nome e o email preenchidos a partir da conta
6. Confirma → página de sucesso → **saem dois emails**

Um só percurso serve os dois serviços; `/videos/marcar-reuniao` e
`/sites-ia/contacto` passam a entrar nele com o serviço pré-escolhido.

### Base de dados

Modelo `Booking`:

| Campo | Notas |
| --- | --- |
| `id`, `createdAt`, `updatedAt` | |
| `userId` | conta que marcou |
| `service` | `videos` \| `sites` |
| `startsAt` | guardado em UTC |
| `durationMin` | 30 por omissão |
| `clientName`, `clientEmail`, `clientPhone` | |
| `subject` | nome do imóvel ou da empresa |
| `subjectType` | Airbnb / AL / hotel / tipo de negócio |
| `message` | texto livre |
| `status` | `marcada` \| `realizada` \| `cancelada` |

`@@unique([startsAt])` para dois visitantes não ficarem com a mesma
hora. Quem perder a corrida recebe um aviso claro e a lista recarregada,
não um erro em bruto.

Modelo `BlockedSlot` (`from`, `to`, `reason`) para bloqueares férias ou
uma tarde ocupada a partir do `/admin`.

### Regras de disponibilidade

Ficam num sítio só, em `src/lib/agenda.ts`:

- dias e horas de trabalho (por definir contigo — ver secção 6)
- duração da reunião: 30 min
- intervalo entre reuniões: 15 min
- antecedência mínima: 12 h (ninguém marca para daqui a 10 minutos)
- horizonte: 30 dias
- fuso: `Europe/Lisbon`, com as horas guardadas em UTC

As horas ocupadas saem do cruzamento de `Booking` com `BlockedSlot`.

### O que se perde ao sair do Google — e como se tapa

**O site deixa de saber a tua agenda real.** Se tiveres um compromisso
pessoal no Google Calendar às 15h, o site continua a oferecer as 15h. Só
há duas formas de tapar isto: bloqueares o horário no `/admin`, ou
voltarmos a ligar a agenda do Google por API — que é precisamente o que
querias evitar. Fica dito antes de ser surpresa.

**Deixa de haver link do Meet automático.** Sem o Google a criar a
reunião, o link tem de vir de algum lado. Recomendo uma **sala fixa**
(um link permanente do Meet, Zoom ou Whereby) guardado em configuração e
enviado em todos os emails — custo zero e o cliente já sabe para onde
vai. A alternativa é mandares o link à mão quando confirmas.

**Ficheiro `.ics` anexado** ao email de confirmação, para a reunião
entrar no calendário do cliente (e no teu) com um clique. É isto que
substitui o convite que o Google mandava.

---

## 2. Emails

### O modelo visual

Um único `layout()` partilhado, no tema do site:

- largura 600 px, tabelas (é o que os clientes de email aceitam), CSS
  todo em atributos `style` — nada de folhas de estilo externas
- barra superior **navy `#0b2545`** com o logótipo em PNG, servido de
  `https://nextiamarketing.website/logo.png` (URL absoluto — emails não resolvem
  caminhos relativos)
- títulos de secção em **azul `#2f7fe0`**, com um ícone discreto
- confirmações e valores positivos em **verde `#1fa860`**
- texto `#0f2038`, secundário `#4b5769`, linhas `#e3e8ef`
- rodapé cinzento com o nome da marca, o WhatsApp e uma linha a dizer
  que é automático
- versão em **texto simples** em todos os envios, para quem tem imagens
  desligadas e para não cair no spam

### Os emails a criar

**1. Nova marcação → `nextvisionia1@gmail.com`**
O mais importante. Assunto: `Nova reunião — {serviço} — {dia} às {hora}`.
Secções:

- **Reunião**: serviço, dia por extenso, hora, duração, link da sala
- **Cliente**: nome, email (clicável), telefone (clicável), conta usada
- **Projeto**: imóvel ou empresa, tipo, mensagem que escreveu
- **Origem**: página de onde veio e data do registo da conta
- botão **Ver no back-office** para `/admin`
- `.ics` anexado

**2. Confirmação → cliente**
Assunto: `A tua reunião está marcada — {dia} às {hora}`. É o equivalente
ao email da referência: saudação, resumo do que ficou marcado, o que
levar para a reunião, botão **Adicionar ao calendário**, e uma linha a
dizer que basta responder para alterar. `.ics` anexado.

**3. Conta criada → `nextvisionia1@gmail.com`**
Assunto: `Nova conta — {nome}`. Nome, email, método (Google ou
palavra-passe), data e hora, e total de contas até à data. Sai sempre,
tenha a pessoa marcado alguma coisa ou não.

**4. Novo briefing de site → `nextvisionia1@gmail.com`**
Hoje o pedido de briefing entra na base de dados e mais nada te avisa.
Passa a ter o mesmo tratamento: todos os campos, botão para o `/admin`.

Os dois emails de confirmação que já existem são reescritos neste
modelo, para tudo falar a mesma língua.

### Regras de envio

- Um email que falhe **nunca** faz a marcação falhar. A marcação grava
  primeiro; o envio vem depois e, se rebentar, fica registado.
- Cada envio fica com estado na base de dados, para se ver no `/admin`
  o que saiu e o que não saiu.
- O endereço de administrador fica em `ADMIN_EMAIL`, não escrito no
  código.

---

## 3. Resend e o domínio

O domínio já existe: **`nextiamarketing.website`**, comprado a 11/09/2026,
com os nameservers na Vercel e o site já a abrir nele com HTTPS. É isso
que permite escrever a qualquer endereço — o Resend exige um domínio
verificado com registos DNS próprios, e agora o DNS é nosso.

Falta a **conta do Resend** e uma **chave de API**. Com elas:

1. adiciono `nextiamarketing.website` ao Resend
2. crio os registos DNS que ele pede — SPF, DKIM e o MX de devoluções —
   pela Vercel, sem precisares de mexer em nada
3. acrescento um registo **DMARC**, que é o que mais pesa para os emails
   irem para a caixa de entrada e não para o spam
4. o remetente passa a ser `reunioes@nextiamarketing.website`

A partir daí saem os emails para ti **e** para o cliente.

Uma ressalva honesta: os filtros de spam olham com mais desconfiança
para terminações baratas como `.website` do que para `.pt` ou `.com`.
SPF, DKIM e DMARC bem configurados compensam a maior parte disso, e um
domínio novo ganha reputação com o uso. Se algum cliente disser que não
recebeu, a primeira coisa a pedir é que veja o spam.

Nota pequena: a marca é **NextIA Marketing** e o endereço é
**nextvisionia1@**. Como só serve para receber, ninguém repara — mas se
um dia o puseres no site, convém que os nomes batam certo.

---

## 4. Back-office

- lista de **Reuniões** com dia, hora, serviço, cliente e estado, e
  botões para marcar como realizada ou cancelada
- **bloquear** um dia ou um intervalo, para o site deixar de o oferecer
- ver a que conta pertence cada pedido
- ver se os emails saíram

---

## 5. Ordem de trabalho

1. Modelo de email partilhado, no tema, com logótipo e texto simples
2. Notificações ao administrador (marcação, conta, briefing) — é o que
   funciona assim que houver chave
3. Base de dados: `Booking` e `BlockedSlot`
4. Regras de disponibilidade e cálculo das horas livres
5. Interface de marcação: calendário, horas, confirmação
6. `.ics` e link da sala
7. Reunião ligada à conta e visível no `/admin`
8. Bloqueio de horários no `/admin`
9. Retirar o iframe do Google e a variável que o guardava

---

## 6. O que preciso de ti

| # | O quê | Sem isto |
| --- | --- | --- |
| 1 | **Chave do Resend**, de uma conta criada com `nextvisionia1@gmail.com` | não sai email nenhum |
| 2 | **Dias e horas** em que aceitas reuniões (ex.: seg–sex, 9h–13h e 14h–19h) | fico por um valor inventado |
| 3 | **Link da sala** de videochamada, se quiseres sala fixa | o link vai à mão |
| 4 | Confirmares que o administrador é mesmo `nextvisionia1@gmail.com` | os avisos vão para o sítio errado |

---

## 7. Critérios de aceitação

- [ ] O site já não mostra nem carrega nada do Google Calendar
- [ ] Marcar reunião é um percurso do site: serviço → dia → hora → confirmar
- [ ] Duas pessoas não conseguem ficar com a mesma hora
- [ ] Horas passadas, fora de horário ou bloqueadas não aparecem
- [ ] Cada marcação manda email detalhado para `nextvisionia1@gmail.com`
- [ ] Cada conta criada manda email para `nextvisionia1@gmail.com`
- [ ] Cada briefing manda email para `nextvisionia1@gmail.com`
- [ ] Todos os emails usam o modelo da marca, com logótipo e texto simples
- [ ] A confirmação ao cliente leva `.ics` que abre no calendário
- [ ] Um email que falhe não faz a marcação falhar
- [ ] As reuniões aparecem no `/admin` e podem ser bloqueadas datas
- [ ] `npx eslint .` limpo e `npm run build` a compilar
- [ ] Verificado em produção, com um email verdadeiro recebido
