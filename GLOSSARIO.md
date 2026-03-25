# Glossário

Termos que aparecem ao longo do curso, explicados de forma simples.

## Main Process

O processo principal do Electron. Roda em Node.js, cria janelas e tem acesso total ao sistema operacional. Pense nele como o "backend local" do seu app.

## Renderer Process

O processo que roda dentro de cada janela. É onde o React vive. Pense nele como o "frontend" — funciona como um navegador Chromium embutido.

## Preload Script

Um script que roda antes do renderer carregar. Serve como ponte segura entre o main process e o renderer. Define quais APIs do sistema o React pode acessar.

## Context Bridge

A API do Electron (`contextBridge`) que permite expor funções do preload para o renderer de forma segura, sem dar acesso direto ao Node.js.

## IPC (Inter-Process Communication)

O mecanismo de comunicação entre o main process e o renderer. Funciona com mensagens: o renderer envia uma mensagem, o main processa e responde.

## BrowserWindow

A classe do Electron que cria janelas nativas. Cada janela contém um renderer process com seu próprio Chromium embutido.

## electron-vite

Um bundler que configura o Vite para os três processos do Electron (main, preload, renderer) automaticamente. Permite usar hot reload durante o desenvolvimento.

## electron-builder

Ferramenta que empacota o app Electron em instaladores nativos (.exe, .dmg, .AppImage, .deb) para distribuição.

## Context Isolation

Um recurso de segurança do Electron que isola o código do preload do código do renderer, impedindo que o renderer acesse Node.js diretamente.

## Sandbox

Modo de segurança que restringe o que um processo pode fazer. No Electron, o renderer em sandbox não tem acesso a APIs do Node.js.

## ASAR

Formato de arquivo usado pelo Electron para empacotar o código-fonte do app em um único arquivo, como um ZIP mas otimizado para leitura.

## CSP (Content Security Policy)

Política de segurança que define quais recursos (scripts, estilos, imagens) uma página pode carregar. Importante para prevenir ataques XSS.
