// ============================================================
// src/renderer/src/App.tsx — Componente raiz do React
//
// Este é o seu React de sempre! A única diferença é que ele
// roda dentro de uma janela Electron em vez do navegador.
// ============================================================

function App(): JSX.Element {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Electron Notas</h1>
      <p>Se você está vendo esta janela, o Electron está funcionando.</p>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>
        Este é o renderer process &mdash; é aqui que o React vive.
      </p>

      {/*
        DESAFIO: Mostre as versões do Electron, Chrome e Node.js
        Dica: use window.electron.process.versions

        Exemplo:
        const versions = window.electron.process.versions
        <p>Electron: {versions.electron}</p>
      */}
    </div>
  )
}

export default App
