# Lição 01 — Entendendo o Electron

> Nesta lição você vai entender o que cada arquivo do projeto faz e como o Electron transforma código web em um app desktop.

## Rode o projeto

Antes de ler qualquer explicação, rode o app e veja ele funcionar:

```bash
npm install
npm run dev
```

Uma janela vai abrir com o texto "Electron Notas". Isso é o seu app desktop rodando.

## Agora explore o código

Abra estes arquivos no seu editor e leia os comentários:

1. `src/main/index.ts` — O "backend" do app (cria a janela)
2. `src/preload/index.ts` — A ponte entre backend e frontend
3. `src/renderer/src/App.tsx` — O React de sempre

Cada arquivo tem comentários explicando o que cada bloco faz e por quê.

## A estrutura do projeto

```
electron-notas/
├── src/
│   ├── main/           ← O "backend" do app (Node.js)
│   │   └── index.ts
│   ├── preload/        ← A ponte entre backend e frontend
│   │   ├── index.ts
│   │   └── index.d.ts
│   └── renderer/       ← O "frontend" do app (React)
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

## Os três processos do Electron

| Mundo web | Electron | Pasta |
|-----------|----------|-------|
| Frontend (React no navegador) | **Renderer process** | `src/renderer/` |
| Backend (Express, API) | **Main process** | `src/main/` |
| Não tem equivalente direto | **Preload script** | `src/preload/` |

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

Abra o `App.tsx` e procure o comentário `DESAFIO`. Mostre as versões do Electron, Chrome e Node.js na tela.

## Próxima lição

> **Nota:** Ao trocar de lição, suas mudanças locais serão sobrescritas. Se quiser guardar seu desafio, faça um commit antes:
> ```bash
> git add -A && git commit -m "meu desafio da lição 01"
> ```

```bash
git checkout lesson-02
npm install
```

Na lição 02, vamos entender o preload a fundo e criar nossa primeira função no Context Bridge.
