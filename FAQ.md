# Perguntas Frequentes

## O app não abre quando rodo `npm run dev`

Verifique se o `npm install` completou sem erros. Se houver erros de dependência nativa, tente:

```bash
rm -rf node_modules
npm install
```

No Windows, se `electron` falhar ao instalar, verifique se seu antivírus não está bloqueando.

## Erro "Cannot find module 'electron'"

Isso geralmente acontece quando o `npm install` não completou. Rode `npm install` novamente.

## A janela abre mas fica em branco

Verifique o console do DevTools (Ctrl+Shift+I na janela do app). Provavelmente há um erro no código do renderer.

## Posso usar JavaScript em vez de TypeScript?

O curso usa TypeScript, mas os conceitos de Electron são os mesmos. Se quiser, pode renomear os arquivos de `.ts`/`.tsx` para `.js`/`.jsx` e remover as tipagens.

## Posso pular lições?

Cada lição parte do código da anterior. Se pular, pode perder contexto. Recomendamos seguir na ordem, mas se já sabe o assunto, pode ir direto fazendo `git checkout lesson-XX`.

## O hot reload não funciona

O hot reload funciona no renderer (React). Mudanças no main process ou preload exigem reiniciar o app (Ctrl+C e `npm run dev` de novo).

## Posso usar outro framework no lugar do React?

O Electron funciona com qualquer framework web. Este curso usa React porque é o mais popular e provavelmente o que você já sabe. Os conceitos de Electron (IPC, preload, main process) são os mesmos independente do framework.

## O `npm run build` falha

O build de produção roda o `typecheck` antes. Corrija os erros de TypeScript primeiro:

```bash
npm run typecheck
```

## Como debugo o main process?

A lição 09 cobre isso em detalhes. Resumo rápido: use `--inspect` flag e conecte o Chrome DevTools.
