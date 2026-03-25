# Lição 02 — Preload e Context Bridge

> Nesta lição você vai entender como o renderer (React) se comunica com o main process de forma segura, usando o preload script e o Context Bridge.

## O que mudou desde a lição 01

```bash
git diff lesson-01..lesson-02 --stat
```

Arquivos modificados:
- `src/preload/index.ts` — Agora tem funções customizadas
- `src/preload/index.d.ts` — Tipos atualizados para as novas funções
- `src/main/index.ts` — Mudou `ipcMain.on` para `ipcMain.handle`
- `src/renderer/src/App.tsx` — Usa as novas APIs do preload

## O problema que o preload resolve

Imagine que o renderer (React) pudesse acessar o Node.js diretamente. Qualquer código JavaScript na página poderia ler arquivos do sistema, executar comandos, acessar a rede sem restrições. Se um atacante injetasse código na sua página (XSS), ele teria acesso total ao computador do usuário.

O preload resolve isso criando uma **lista explícita** do que o renderer pode fazer. É como um cardápio: o renderer só pode pedir o que está no cardápio.

## Como o Context Bridge funciona

O `contextBridge.exposeInMainWorld` cria uma ponte entre dois mundos isolados:

```
[Main Process]  <--->  [Preload]  <--->  [Renderer/React]
   Node.js              Ponte            window.api
```

O preload tem acesso ao Node.js e ao `ipcRenderer`. Ele escolhe quais funções expor ao renderer. O renderer só vê o que foi exposto em `window.api`.

## O que fizemos nesta lição

### 1. Criamos funções no preload

No `src/preload/index.ts`, o objeto `api` agora tem três funções:

- `getVersions()` — Retorna versões do Electron/Chrome/Node (acesso direto ao `process`)
- `ping()` — Envia uma mensagem ao main process via IPC e espera a resposta
- `getPlatform()` — Retorna o sistema operacional

### 2. Mudamos o IPC de `on` para `handle`

Na lição 01, tínhamos `ipcMain.on('ping', ...)`. Agora usamos `ipcMain.handle('ping', ...)`. A diferença:

- `on` / `send` — Comunicação de mão única (fire and forget)
- `handle` / `invoke` — Comunicação de ida e volta (request/response)

Pense em `handle`/`invoke` como um endpoint de API: você faz um request e recebe uma response.

### 3. Atualizamos os tipos

O `src/preload/index.d.ts` agora declara a interface completa de `window.api`, para que o TypeScript saiba o que está disponível no renderer.

### 4. O React usa as novas APIs

O `App.tsx` agora chama `window.api.getVersions()` e `window.api.getPlatform()` no `useEffect`, e tem um botão que chama `window.api.ping()` para testar a comunicação IPC.

## Regra de ouro do preload

Nunca exponha funções genéricas como `executeCommand` ou `readFile` no preload. Sempre crie funções específicas para cada operação que o renderer precisa.

Ruim: `api.execute('rm -rf /')` — O renderer pode fazer qualquer coisa.

Bom: `api.getNotes()` — O renderer só pode buscar notas.

## Teste seu entendimento

1. Por que usamos `ipcRenderer.invoke` em vez de `ipcRenderer.send`?
2. O que aconteceria se você tentasse acessar `require('fs')` diretamente no App.tsx?
3. Por que atualizamos o `index.d.ts` junto com o `index.ts`?

<details>
<summary>Ver respostas</summary>

1. Porque `invoke` retorna uma Promise com a resposta do main process. `send` só envia, sem esperar resposta.
2. Daria erro. O renderer roda em ambiente de navegador (Chromium) e não tem acesso ao Node.js. Só o que o preload expõe está disponível.
3. Para que o TypeScript saiba quais funções existem em `window.api` e dê autocomplete e verificação de tipos.

</details>

## Desafio

Adicione uma nova função ao preload que retorna o diretório home do usuário (`os.homedir()`). Exponha-a como `api.getHomeDir()` e mostre o resultado no App.tsx.

<details>
<summary>Dica</summary>

No preload, importe `os` do Node.js e adicione ao objeto `api`:

```ts
import { homedir } from 'os'

const api = {
  // ... funções existentes
  getHomeDir: (): string => homedir()
}
```

Não esqueça de atualizar o `index.d.ts` também!

</details>

## Próxima lição

```bash
git checkout lesson-03
npm install
```

Na lição 03, vamos construir a interface do app de notas com componentes React e estilo.
