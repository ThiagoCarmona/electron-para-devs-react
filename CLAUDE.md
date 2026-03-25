# Contexto para Agentes de Código

## Sobre este projeto

Este é um repositório de aprendizado: **Electron para Devs React**. Um curso progressivo onde o aluno constrói um app de notas desktop com Electron + React + TypeScript.

Cada lição é uma branch do Git. O aluno está atualmente na **Lição 11** (a última!).

## Lição 11 — Build e Distribuição

### Objetivo
O aluno está aprendendo a gerar instaladores para Windows, macOS e Linux, e configurar CI/CD.

### O que existe nesta branch
- Tudo da lição 10 +
- `electron-builder.yml` — Configuração completa (NSIS, DMG, AppImage, DEB)
- `.github/workflows/build.yml` — CI/CD com GitHub Actions (3 plataformas)
- Instaladores são gerados na pasta `dist/`

### Stack completa do app
```
Renderer:  React 19 + Zustand + CSS
Preload:   Context Bridge com API tipada
Main:      Electron + better-sqlite3 + menu + tray + notificações
Testes:    Vitest (unitários) + Playwright (E2E)
Build:     electron-vite + electron-builder
CI/CD:     GitHub Actions
```

### Comandos de build
```bash
npm run build          # Build de produção (typecheck + compile)
npm run build:win      # Gera .exe (NSIS installer)
npm run build:mac      # Gera .dmg (x64 + arm64)
npm run build:linux    # Gera .AppImage + .deb
```

### Cuidados com better-sqlite3
- É dependência nativa — precisa estar em `asarUnpack`
- `npmRebuild: true` recompila para a versão do Electron
- Build só funciona para a plataforma atual (por isso CI/CD com 3 runners)

### CI/CD
O workflow roda quando uma tag `v*` é criada:
```bash
git tag v1.0.0
git push origin v1.0.0
```

### O que falta para distribuição profissional
- Ícones do app (`build/icon.ico`, `icon.icns`, `icons/`)
- Code signing (certificado digital)
- Auto-update com `electron-updater`
- Notarização no macOS

### Como ajudar o aluno
- Este é o app completo — o aluno pode experimentar e expandir
- Sugestões de próximos passos: markdown rendering, sincronização com nuvem, auto-update
- Se o build falhar por causa do SQLite: verificar build tools (Visual Studio Build Tools no Windows, xcode-select no macOS)

### Comandos úteis
```bash
npm install
npm run dev              # Desenvolvimento
npm test                 # Testes unitários
npm run build            # Build de produção
npm run build:win        # Instalador Windows
npm run build:mac        # Instalador macOS
npm run build:linux      # Instalador Linux
```

### Navegação
```bash
git checkout lesson-10   # Lição anterior
git checkout main        # Voltar para a documentação geral
```
