# Lição 01 — Entendendo o Electron

> Nesta lição você vai entender o que cada arquivo do projeto faz e como o Electron transforma código web em um app desktop.

## O que vamos ver

Quando você roda `npm create @quick-start/electron` e escolhe React + TypeScript, o comando gera um projeto com vários arquivos. Em vez de aceitar essa estrutura como mágica, vamos abrir cada arquivo e entender o papel dele.

Ao final desta lição, você vai saber responder:

- O que é o main process e o que é o renderer process?
- Por que existem três pastas dentro de `src/`?
- Como o Electron sabe qual janela abrir?
- Por que o React está numa subpasta e não na raiz?

## Rode o projeto

Antes de ler qualquer explicação, rode o app e veja ele funcionar:

```bash
npm install
npm run dev
```

Uma janela vai abrir com o texto "Electron Notas". Isso é o seu app desktop rodando.

## A estrutura do projeto

```
electron-notas/
├── src/
│   ├── main/           ← O "backend" do app
│   │   └── index.ts
│   ├── preload/        ← A ponte entre backend e frontend
│   │   ├── index.ts
│   │   └── index.d.ts
│   └── renderer/       ← O "frontend" do app (seu React)
│       ├── index.html
│       └── src/
│           ├── main.tsx
│           ├── App.tsx
│           └── env.d.ts
├── electron.vite.config.ts
├── electron-builder.yml
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── tsconfig.web.json
```

Se você já trabalha com React, vai notar algo familiar: tem um `index.html`, um `main.tsx`, um `App.tsx`. É o seu React de sempre. A diferença é que ele está dentro de `src/renderer/`, e existem duas pastas novas: `src/main/` e `src/preload/`.

## Os três processos do Electron

No mundo web, você tem dois lados: o **frontend** (React no navegador) e o **backend** (Express, Next API routes, etc). Eles se comunicam por HTTP.

No Electron, a ideia é parecida mas com nomes diferentes:

| Mundo web | Electron | Pasta |
|-----------|----------|-------|
| Frontend (React no navegador) | **Renderer process** | `src/renderer/` |
| Backend (Express, API) | **Main process** | `src/main/` |
| Não tem equivalente direto | **Preload script** | `src/preload/` |

O **renderer** é onde seu React vive. Ele roda dentro de uma janela Chromium embutida.

O **main process** é o "backend local". Ele roda em Node.js, cria as janelas, e tem acesso total ao sistema operacional.

O **preload** é a ponte segura entre os dois. Ele decide o que o renderer pode acessar do main process.

## Arquivo por arquivo

### `src/main/index.ts` — O ponto de entrada

Este é o primeiro arquivo que roda quando o app abre. Ele cria a janela e configura o ciclo de vida do app.

As importações do `electron` são as APIs nativas: `app` controla o ciclo de vida, `BrowserWindow` cria janelas, `shell` abre links no navegador do sistema, e `ipcMain` recebe mensagens do renderer.

A função `createWindow()` cria uma `BrowserWindow` com `show: false` (começa escondida para evitar flash branco) e aponta o `preload` para o script de ponte.

Em desenvolvimento, o renderer carrega de uma URL local (hot reload do Vite). Em produção, carrega de um arquivo HTML estático.

### `src/preload/index.ts` — A ponte segura

O preload é curto mas importante. Ele usa `contextBridge.exposeInMainWorld` para expor funções ao React de forma segura. Por enquanto expõe um objeto `api` vazio — nas próximas lições vamos adicionar funções aqui.

### `src/renderer/` — O React de sempre

Essa parte você já conhece: `index.html` com um `<div id="root">`, `main.tsx` que monta o React, e `App.tsx` como componente raiz.

### `electron.vite.config.ts`

Em vez de uma configuração Vite só, existem três: `main`, `preload` e `renderer`. Cada processo tem seu próprio build.

## O fluxo de inicialização

```
1. electron-vite inicia três builds (main, preload, renderer)
2. O Vite do renderer sobe um dev server com hot reload
3. O Electron executa src/main/index.ts
4. O main process cria uma BrowserWindow
5. A janela carrega o preload script
6. O preload expõe a API no window
7. A janela carrega o React do dev server
8. O React monta o App.tsx no DOM
9. Você vê a janela com "Electron Notas"
```

## Teste seu entendimento

1. Se quisesse mudar o tamanho da janela, em qual arquivo faria isso?
2. Por que o renderer carrega de uma URL em dev mas de um arquivo em produção?
3. O que aconteceria se removesse o preload da configuração do BrowserWindow?

<details>
<summary>Ver respostas</summary>

1. No `src/main/index.ts`, nas propriedades `width` e `height` do `BrowserWindow`.
2. Em dev, o Vite serve com hot reload. Em produção, não tem servidor — o HTML é estático dentro do app empacotado.
3. O renderer não teria acesso a `window.electron` nem `window.api`. O React funcionaria como página web normal, mas sem acesso ao desktop.

</details>

## Desafio

Modifique o `App.tsx` para mostrar a versão do Electron, do Chrome e do Node.js. Essas informações estão em `window.electron.process.versions`.

<details>
<summary>Dica</summary>

```tsx
const versions = window.electron.process.versions
```

Depois exiba `versions.electron`, `versions.chrome` e `versions.node` no JSX.

</details>

## Próxima lição

```bash
git checkout lesson-02
npm install
```

Na lição 02, vamos entender o preload a fundo e criar nossa primeira função no Context Bridge.
