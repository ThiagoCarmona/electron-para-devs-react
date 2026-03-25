// ============================================================
// src/main/index.ts — Ponto de entrada do main process
//
// Este é o PRIMEIRO arquivo que roda quando o app abre.
// Pense nele como o "servidor" do seu app desktop.
// Ele cria janelas, gerencia o ciclo de vida do app,
// e futuramente vai processar requisições do React.
// ============================================================

// APIs do Electron:
// - app: controla o ciclo de vida (quando abre, quando fecha)
// - shell: abre links no navegador padrão do sistema
// - BrowserWindow: cria janelas nativas (como abas, mas em janelas do SO)
// - ipcMain: recebe mensagens do renderer (veremos na lição 02)
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'

// Utilitários do electron-toolkit que simplificam tarefas comuns:
// - electronApp: configurações do app (ID, etc)
// - optimizer: atalhos de teclado para DevTools
// - is: verifica se estamos em dev ou produção
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

/**
 * Cria a janela principal do app.
 *
 * No mundo web, você abre o navegador e acessa uma URL.
 * No Electron, você cria uma BrowserWindow e carrega HTML nela.
 * É como ter um Chrome embutido dentro do seu app.
 */
function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,

    // Começa escondida para evitar "flash branco" enquanto carrega
    show: false,

    // Esconde a barra de menu padrão (Arquivo, Editar, etc)
    autoHideMenuBar: true,

    webPreferences: {
      // Aponta para o preload script (a ponte entre main e renderer)
      // O __dirname aponta para a pasta do main compilado
      preload: join(__dirname, '../preload/index.js'),

      // sandbox: false permite que o preload acesse APIs do Node.js
      sandbox: false
    }
  })

  // Quando o conteúdo terminar de carregar, mostra a janela.
  // É como esperar o DOMContentLoaded no navegador.
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Se o usuário clicar num link (<a href="...">), abre no navegador padrão
  // em vez de navegar dentro da janela do Electron.
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' } // 'deny' impede que abra dentro do app
  })

  // Em DESENVOLVIMENTO: carrega do servidor Vite (com hot reload)
  // Em PRODUÇÃO: carrega o arquivo HTML estático empacotado
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ============================================================
// Ciclo de vida do app
// ============================================================

// app.whenReady() é como o DOMContentLoaded do app inteiro.
// Só depois disso podemos criar janelas.
app.whenReady().then(() => {
  // Define um ID único para o app (usado pelo Windows na taskbar)
  electronApp.setAppUserModelId('com.electron')

  // Configura atalhos de DevTools em cada janela criada
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Exemplo simples de IPC: o renderer pode enviar 'ping'
  // e o main responde no console. Vamos explorar IPC na lição 02.
  ipcMain.on('ping', () => console.log('pong'))

  // Cria a janela principal
  createWindow()

  // macOS: quando clica no ícone do dock sem janela aberta, cria uma nova.
  // No Windows/Linux isso não acontece (o app já teria encerrado).
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quando TODAS as janelas são fechadas:
// - Windows/Linux: encerra o app
// - macOS ('darwin'): mantém o app aberto no dock (comportamento padrão do macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
