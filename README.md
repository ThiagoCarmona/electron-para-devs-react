# Lição 11 — Build e Distribuição

> Nesta lição última lição! Vamos gerar instaladores para Windows, macOS e Linux, e configurar CI/CD.

## O que mudou desde a lição 10

```bash
git diff lesson-10..lesson-11 --stat
```

Arquivos novos:
- `.github/workflows/build.yml` — CI/CD com GitHub Actions

Arquivos modificados:
- `electron-builder.yml` — Configuração completa de build

## Gerando instaladores localmente

### Windows (.exe)

```bash
npm run build:win
```

Gera um instalador NSIS em `dist/`. O usuário roda o `.exe` e o app é instalado no Windows.

### macOS (.dmg)

```bash
npm run build:mac
```

Gera um `.dmg` para x64 e arm64 (Apple Silicon). O usuário abre o `.dmg` e arrasta para Applications.

### Linux (.AppImage + .deb)

```bash
npm run build:linux
```

Gera:
- `.AppImage` — Executável portátil (funciona em qualquer distro)
- `.deb` — Pacote para Debian/Ubuntu (`sudo dpkg -i`)

## O que o electron-builder faz

1. Compila o TypeScript com electron-vite
2. Empacota o código compilado em um arquivo ASAR
3. Inclui o runtime do Electron
4. Cria o instalador nativo para a plataforma

## Configurações importantes

### `asarUnpack`

```yaml
asarUnpack:
  - resources/**
  - node_modules/better-sqlite3/**
```

O `better-sqlite3` tem código nativo (compilação C++). Ele não funciona dentro do ASAR, então precisa ser extraído.

### `npmRebuild: true`

Recompila dependências nativas para a versão do Electron (que pode ser diferente do Node.js do seu sistema).

### Build por plataforma

Você só pode gerar o instalador da plataforma onde está rodando:
- Windows só gera `.exe`
- macOS só gera `.dmg`
- Linux só gera `.AppImage`/`.deb`

Para gerar para todas as plataformas, usamos CI/CD.

## CI/CD com GitHub Actions

O `.github/workflows/build.yml` roda automaticamente quando você cria uma tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

O workflow:
1. Roda em 3 máquinas (Ubuntu, Windows, macOS) em paralelo
2. Instala dependências e roda testes
3. Gera o instalador para cada plataforma
4. Upload dos artefatos

## Distribuindo o app

Opções para distribuir:

1. **GitHub Releases** — Gratuito, funciona com `electron-updater`
2. **Site próprio** — Hospedar os instaladores para download
3. **Microsoft Store / Mac App Store** — Requer assinatura de código e revisão

Para auto-update, configure o `publish` no `electron-builder.yml` com o provider desejado.

## Checklist de distribuição

- [x] Build funciona para as 3 plataformas
- [x] CI/CD configurado
- [x] Dependências nativas (SQLite) empacotadas corretamente
- [ ] Ícones do app (precisa criar `build/icon.ico`, `icon.icns`, `icons/`)
- [ ] Assinatura de código (necessário para distribuição profissional)
- [ ] Auto-update configurado

## Teste seu entendimento

1. Por que o `better-sqlite3` precisa ficar fora do ASAR?
2. Por que não podemos gerar o instalador do Windows no macOS?
3. O que é assinatura de código e por que é importante?

<details>
<summary>Ver respostas</summary>

1. Porque é um módulo nativo (compilado em C++). O Node.js precisa carregar o arquivo `.node` diretamente do filesystem, o que não funciona dentro de um arquivo ASAR.
2. Porque o instalador NSIS é uma ferramenta Windows. O electron-builder precisa das ferramentas nativas da plataforma alvo. Por isso usamos CI/CD com 3 máquinas.
3. Assinatura digital prova que o app vem de você e não foi alterado. Sem ela, o Windows mostra "Editor desconhecido" e o macOS bloqueia a execução.

</details>

## Parabéns!

Você completou o curso! Ao longo de 11 lições, você:

- Entendeu a arquitetura do Electron (main, preload, renderer)
- Construiu uma interface React completa
- Implementou comunicação IPC bidirecional
- Persistiu dados com SQLite
- Adicionou APIs nativas (menu, diálogos, notificações, tray)
- Gerenciou estado com Zustand
- Aplicou boas práticas de segurança
- Configurou debug e logging
- Escreveu testes unitários e E2E
- Gerou instaladores para distribuição

Agora você tem uma base sólida para construir qualquer app desktop com Electron e React.

## Próximos passos sugeridos

- Adicione ícones personalizados ao app
- Implemente auto-update com `electron-updater`
- Adicione markdown rendering nas notas (ex: `marked` ou `react-markdown`)
- Implemente sincronização com a nuvem
- Publique na Microsoft Store ou Mac App Store
