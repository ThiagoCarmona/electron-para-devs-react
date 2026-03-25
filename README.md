# Lição 10 — Testes

> Nesta lição adicionamos testes unitários com Vitest e testes E2E com Playwright.

## O que mudou desde a lição 09

```bash
git diff lesson-09..lesson-10 --stat
```

Arquivos novos:
- `vitest.config.ts` — Configuração do Vitest
- `playwright.config.ts` — Configuração do Playwright
- `tests/unit/validation.test.ts` — Testes da validação
- `tests/e2e/app.spec.ts` — Testes E2E do app

Arquivos modificados:
- `package.json` — Adicionou vitest, playwright e scripts de teste

## Dois tipos de teste

### Testes unitários (Vitest)

Testam funções isoladas, sem precisar do Electron rodando. Rápidos de executar.

```bash
npm test           # Roda uma vez
npm run test:watch # Roda em modo watch (re-executa ao salvar)
```

### Testes E2E (Playwright)

Abrem o app real e interagem com ele como um usuário faria. Mais lentos, mas testam o fluxo completo.

```bash
npm run build      # Precisa buildar antes
npm run test:e2e   # Roda os testes E2E
```

## O que testamos

### Unitários: `tests/unit/validation.test.ts`

Testa as funções de validação criadas na lição 08:

- `validateNoteInput` — Valida tipos, strings vazias, limites de tamanho
- `validateId` — Valida UUID, caracteres especiais, SQL injection
- `sanitizeString` — Remove caracteres de controle, mantém acentos/emojis

### E2E: `tests/e2e/app.spec.ts`

Testa o app rodando:

- A janela abre com o título correto
- A sidebar mostra "Notas"
- Clicar em "+ Nova" cria uma nota

## Por que Vitest?

Vitest usa a mesma configuração do Vite, então funciona sem configuração extra. Suporta TypeScript nativamente e tem API compatível com Jest.

## Por que Playwright?

Playwright tem suporte nativo a Electron via `_electron`. Ele:

1. Inicia o app como um usuário faria
2. Encontra a janela automaticamente
3. Permite interagir com elementos (clicar, digitar, esperar)
4. Pode acessar APIs do Electron durante o teste

## Anatomia de um teste unitário

```ts
describe('validateId', () => {
  it('aceita UUID v4', () => {
    expect(validateId('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
  })

  it('rejeita SQL injection', () => {
    expect(validateId('id; DROP TABLE notes')).toBe(false)
  })
})
```

- `describe` — Agrupa testes relacionados
- `it` — Um caso de teste específico
- `expect` — Asserção do resultado esperado

## Anatomia de um teste E2E

```ts
test('a janela abre com o título correto', async () => {
  const electronApp = await electron.launch({
    args: [join(__dirname, '../../out/main/index.js')]
  })
  const window = await electronApp.firstWindow()
  const title = await window.title()
  expect(title).toBe('Electron Notas')
  await electronApp.close()
})
```

O padrão: abre o app, faz algo, verifica o resultado, fecha.

## Teste seu entendimento

1. Por que testes unitários não precisam do Electron rodando?
2. Por que o teste E2E precisa do `npm run build` antes?
3. Quando usar unit vs E2E?

<details>
<summary>Ver respostas</summary>

1. Porque testam funções puras de JavaScript que não dependem do Electron. `validateId` é só lógica de string.
2. Porque o Playwright abre o app compilado (`out/main/index.js`), não o código TypeScript. Precisa dos arquivos buildados.
3. Unit para lógica pura (validação, formatação, cálculos). E2E para fluxos completos (criar nota, exportar, navegar).

</details>

## Desafio

Adicione um teste unitário para a função `getAllNotes` do `src/main/notes.ts`. Você vai precisar mockar o `getDatabase` para retornar um banco em memória.

## Próxima lição

```bash
git checkout lesson-11
npm install
```

Na lição 11, vamos gerar instaladores para Windows, macOS e Linux.
