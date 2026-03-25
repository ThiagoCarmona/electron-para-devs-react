# Lição 08 — Segurança

> Nesta lição endurecemos a segurança do app: validação de inputs, CSP, bloqueio de navegação e permissões.

## O que mudou desde a lição 07

```bash
git diff lesson-07..lesson-08 --stat
```

Arquivos novos:
- `src/main/validation.ts` — Validação e sanitização de inputs

Arquivos modificados:
- `src/main/index.ts` — Configurações de segurança, validação nos handlers
- `src/renderer/index.html` — CSP mais restritiva

## Por que segurança em app desktop?

Você pode pensar: "Meu app é local, não é um site. Quem vai atacar?" Existem riscos reais:

1. Se o app importa arquivos, um arquivo malicioso pode tentar injetar código
2. Se o app abre URLs, links maliciosos podem redirecionar o renderer
3. Se o renderer tiver acesso ao Node.js, um XSS dá controle total do computador
4. Updates automáticos podem ser interceptados (man-in-the-middle)

## O que fizemos

### 1. Validação de input no main process

Criamos `src/main/validation.ts` com três funções:

- `validateNoteInput(title, content)` — Verifica tipos e tamanhos
- `validateId(id)` — Verifica formato do ID
- `sanitizeString(input)` — Remove caracteres de controle

A regra: **nunca confie nos dados do renderer**. Mesmo que o preload pareça seguro, valide tudo no main process.

### 2. CSP (Content Security Policy) mais restritiva

No `index.html`, a CSP agora bloqueia:
- Scripts de fontes externas (`script-src 'self'`)
- Conteúdo embutido malicioso (sem `unsafe-eval`)
- Imagens de fontes externas (`img-src 'self' data:`)

### 3. Configurações do BrowserWindow

```ts
nodeIntegration: false     // Renderer não acessa Node.js
contextIsolation: true     // Preload é isolado do renderer
enableRemoteModule: false  // Módulo remote desabilitado
navigateOnDragDrop: false  // Arrastar arquivo não navega
```

### 4. Bloqueio de navegação

O evento `will-navigate` impede que o renderer navegue para URLs não permitidas. Isso previne ataques onde um link malicioso redireciona a janela.

### 5. Headers de segurança

Adicionamos headers HTTP via `session.webRequest.onHeadersReceived`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### 6. Bloqueio de permissões

`setPermissionRequestHandler` bloqueia pedidos de permissão (câmera, microfone, geolocalização) que o app não precisa.

## Checklist de segurança para Electron

- [x] `nodeIntegration: false`
- [x] `contextIsolation: true`
- [x] CSP definida
- [x] Navegação bloqueada
- [x] Inputs validados no main
- [x] Permissões restringidas
- [x] Links externos abrem no navegador
- [ ] HTTPS para updates (lição 11)

## Teste seu entendimento

1. Por que validamos no main process se o preload já garante os tipos?
2. O que é CSP e por que é importante no Electron?
3. Por que `nodeIntegration: false` é a configuração padrão?

<details>
<summary>Ver respostas</summary>

1. Porque o preload é parte do renderer. Se um atacante conseguir executar código no renderer (XSS), ele pode chamar `window.api` com qualquer input. O main process é a última linha de defesa.
2. CSP define quais recursos podem ser carregados. Sem ela, um XSS poderia carregar scripts externos. No Electron isso é crítico porque scripts têm potencial acesso ao sistema.
3. Porque se `nodeIntegration` fosse `true`, qualquer código no renderer teria acesso a `require('child_process')`, `require('fs')`, etc. Um XSS simples daria controle total do computador.

</details>

## Desafio

Adicione rate limiting ao handler `notes:create` para impedir que um script malicioso crie milhares de notas por segundo. Limite a 10 criações por minuto.

## Próxima lição

```bash
git checkout lesson-09
npm install
```

Na lição 09, vamos aprender a debugar o app — main process, renderer e IPC.
