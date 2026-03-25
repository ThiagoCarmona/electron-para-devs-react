# Electron para Devs React

> Aprenda a construir apps desktop com Electron usando o React que você já conhece.

## O que é este curso

Um curso prático e progressivo onde você vai construir um **app de notas desktop** do zero, usando Electron + React + TypeScript.

Cada lição é uma branch do Git. Você avança pelo curso fazendo `git checkout` entre as branches, e cada README explica o que mudou e por quê.

## Para quem é

- Devs que já sabem React (hooks, componentes, estado)
- Que querem aprender a fazer apps desktop
- Que preferem aprender fazendo, não lendo documentação

## Pré-requisitos

- React (hooks, componentes funcionais, estado)
- TypeScript básico
- npm e linha de comando
- Git básico (clone, checkout, commit)

Se precisar instalar algo, veja o [SETUP.md](SETUP.md).

## Como usar

1. Clone o repositório:

```bash
git clone https://github.com/ThiagoCarmona/electron-para-devs-react.git
cd electron-para-devs-react
```

2. Vá para a primeira lição:

```bash
git checkout lesson-01
npm install
npm run dev
```

3. Leia o README da lição, explore o código, faça o desafio.

4. Quando terminar, avance:

```bash
git checkout lesson-02
npm install
npm run dev
```

## Roadmap

Veja todas as lições no [ROADMAP.md](ROADMAP.md).

| Lição | Tema | O que você aprende |
|-------|------|--------------------|
| 01 | Entendendo o Electron | Estrutura do projeto, main/renderer/preload |
| 02 | Preload e Context Bridge | Comunicação segura entre processos |
| 03 | React no Renderer | Interface do app de notas com componentes |
| 04 | IPC na Prática | CRUD completo via IPC |
| 05 | Persistência com SQLite | Banco de dados local |
| 06 | APIs Nativas | Menus, diálogos, notificações, tray |
| 07 | Zustand + IPC Bridge | Gerenciamento de estado |
| 08 | Segurança | CSP, validação, sandbox |
| 09 | Debug | DevTools, sourcemaps, logging |
| 10 | Testes | Vitest + Playwright |
| 11 | Build e Distribuição | Instaladores para Win/Mac/Linux |

## Recursos extras

- [SETUP.md](SETUP.md) — Como preparar seu ambiente
- [GLOSSARIO.md](GLOSSARIO.md) — Termos do Electron explicados
- [FAQ.md](FAQ.md) — Perguntas frequentes

## Licença

MIT
