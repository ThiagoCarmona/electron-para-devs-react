/**
 * App.tsx — Componente raiz (Lição 06)
 *
 * Novidades nesta lição:
 * - Importar/Exportar notas via menu nativo (Ctrl+Shift+I / Ctrl+Shift+E)
 * - Notificações nativas do sistema ao importar/exportar com sucesso
 * - IPC bidirecional: o menu nativo (main process) envia eventos para cá
 *
 * ⚠️ Padrão importante: cleanup de listeners IPC no useEffect
 * O main process envia eventos com webContents.send() quando o usuário clica
 * em itens do menu. No renderer, escutamos com ipcRenderer.on().
 *
 * Problema: se registrarmos listeners dentro de um useEffect sem cleanup,
 * a cada re-render o React adiciona MAIS um listener (sem remover o anterior).
 * Isso causa chamadas duplicadas — ex.: clicar "Nova Nota" no menu criaria
 * 2, 3, 4... notas de uma vez.
 *
 * Solução: as funções onMenu*() do preload agora retornam uma função de cleanup.
 * Usamos essa função no return do useEffect para remover o listener antigo.
 */

import { useState, useEffect, useCallback } from 'react'
import { NoteList } from './components/NoteList'
import { NoteEditor } from './components/NoteEditor'
import { Note } from './types'
import './styles/global.css'

function App(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)

  // useCallback memoriza a função para evitar re-criação desnecessária
  const loadNotes = useCallback(async (): Promise<void> => {
    const data = await window.api.getNotes()
    setNotes(data)
    return
  }, [])

  // Carrega todas as notas do banco ao iniciar o app
  useEffect(() => {
    loadNotes().then(() => setLoading(false))
  }, [loadNotes])

  const handleCreateNote = useCallback(async (): Promise<void> => {
    const newNote = await window.api.createNote('Nova nota', '')
    setNotes((prev) => [newNote, ...prev])
    setSelectedNote(newNote)
  }, [])

  // Importar: abre o diálogo nativo de arquivo e cria uma nota com o conteúdo
  const handleImportNote = useCallback(async (): Promise<void> => {
    const imported = await window.api.importNote()
    if (imported) {
      setNotes((prev) => [imported, ...prev])
      setSelectedNote(imported)
      // Mostra uma notificação nativa do sistema operacional
      await window.api.showNotification('Nota importada', `"${imported.title}" foi importada.`)
    }
  }, [])

  // Exportar: salva a nota selecionada como arquivo .txt/.md
  const handleExportNote = useCallback(async (): Promise<void> => {
    if (!selectedNote) return
    const success = await window.api.exportNote(selectedNote.title, selectedNote.content)
    if (success) {
      await window.api.showNotification('Nota exportada', `"${selectedNote.title}" foi salva.`)
    }
  }, [selectedNote])

  // ── Escuta eventos do menu nativo (IPC main → renderer) ──
  // IMPORTANTE: cada onMenu*() retorna uma função de cleanup.
  // O return do useEffect chama todas as cleanups para remover os listeners
  // antigos antes de registrar novos (evita duplicação).
  useEffect(() => {
    const cleanupNew = window.api.onMenuNewNote(() => handleCreateNote())
    const cleanupExport = window.api.onMenuExportNote(() => handleExportNote())
    const cleanupImport = window.api.onMenuImportNote(() => handleImportNote())

    // Cleanup: remove os listeners quando as dependências mudam ou o componente desmonta
    return (): void => {
      cleanupNew()
      cleanupExport()
      cleanupImport()
    }
  }, [handleCreateNote, handleExportNote, handleImportNote])

  const handleSelectNote = (note: Note): void => {
    setSelectedNote(note)
  }

  const handleUpdateNote = async (id: string, title: string, content: string): Promise<void> => {
    const updated = await window.api.updateNote(id, title, content)
    if (!updated) return
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
    if (selectedNote?.id === id) setSelectedNote(updated)
  }

  const handleDeleteNote = async (id: string): Promise<void> => {
    const success = await window.api.deleteNote(id)
    if (!success) return
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (selectedNote?.id === id) setSelectedNote(null)
  }

  if (loading) {
    return (
      <div className="app">
        <div className="empty-state">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Notas</h1>
          <button className="btn-new" onClick={handleCreateNote}>+ Nova</button>
        </div>
        <NoteList
          notes={notes}
          selectedId={selectedNote?.id || null}
          onSelect={handleSelectNote}
          onDelete={handleDeleteNote}
        />
      </aside>
      <main className="editor-area">
        {selectedNote ? (
          <NoteEditor note={selectedNote} onUpdate={handleUpdateNote} />
        ) : (
          <div className="empty-state">
            <p>Selecione uma nota ou crie uma nova</p>
          </div>
        )}
      </main>
    </div>
  )
}

// DESAFIO: Adicione um botão na sidebar para importar notas diretamente
// (sem precisar usar o menu). Dica: chame handleImportNote() no onClick.

export default App
