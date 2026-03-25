import { useState, useEffect } from 'react'

function App(): JSX.Element {
  const [versions, setVersions] = useState({ electron: '', chrome: '', node: '' })
  const [platform, setPlatform] = useState('')
  const [pingResult, setPingResult] = useState('')

  useEffect(() => {
    // Busca as versões via preload API
    const v = window.api.getVersions()
    setVersions(v)

    // Busca a plataforma
    setPlatform(window.api.getPlatform())
  }, [])

  const handlePing = async (): Promise<void> => {
    const result = await window.api.ping()
    setPingResult(result)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Electron Notas</h1>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Versões</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Electron: {versions.electron}</li>
          <li>Chrome: {versions.chrome}</li>
          <li>Node: {versions.node}</li>
        </ul>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Plataforma: {platform}
        </p>
      </section>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Teste de IPC</h2>
        <button onClick={handlePing} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Enviar Ping
        </button>
        {pingResult && (
          <p style={{ marginTop: '0.5rem' }}>
            Resposta do main process: <strong>{pingResult}</strong>
          </p>
        )}
      </section>
    </div>
  )
}

export default App
