# Roadmap

Visão geral de todas as lições do curso, na ordem recomendada.

## Preparação

| Branch | Lição | Descrição |
|--------|-------|-----------|
| `main` | Preparando o ambiente | Instalar Node.js, Git e VS Code. Seguir o [SETUP.md](SETUP.md) |

## Lições

| Branch | Lição | Descrição |
|--------|-------|-----------|
| `lesson-01` | Entendendo o Electron | O que o scaffolding gera e o papel de cada arquivo |
| `lesson-02` | Preload e Context Bridge | Como o renderer se comunica com o main process de forma segura |
| `lesson-03` | React no Renderer | Componentes e estilo para a interface do app de notas |
| `lesson-04` | IPC na Prática | O renderer pede dados, o main process responde — CRUD completo |
| `lesson-05` | Persistência com SQLite | Banco de dados local com better-sqlite3 |
| `lesson-06` | APIs Nativas | Menus, diálogos de arquivo, notificações e tray icon |
| `lesson-07` | Zustand + IPC Bridge | Gerenciar estado no renderer sincronizado com o main via IPC |
| `lesson-08` | Segurança | Boas práticas de segurança no Electron |
| `lesson-09` | Debug | Como debugar o main process, DevTools e investigar erros |
| `lesson-10` | Testes | Testes unitários com Vitest e E2E com Playwright |
| `lesson-11` | Build e Distribuição | Gerar instalador para Windows, macOS e Linux |

## Como navegar

Para ir a uma lição:

```bash
git checkout lesson-01
npm install
npm run dev
```

Para ver o que mudou entre duas lições:

```bash
git diff lesson-01..lesson-02 --stat
```
