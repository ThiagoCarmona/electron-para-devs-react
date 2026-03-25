function App(): JSX.Element {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Electron Notas</h1>
      <p>Se você está vendo esta janela, o Electron está funcionando.</p>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>
        Este é o renderer process &mdash; é aqui que o React vive.
      </p>
    </div>
  )
}

export default App
