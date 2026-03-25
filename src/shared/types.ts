export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

// Canais IPC usados pelo app
export const IPC_CHANNELS = {
  NOTES_GET_ALL: 'notes:getAll',
  NOTES_CREATE: 'notes:create',
  NOTES_UPDATE: 'notes:update',
  NOTES_DELETE: 'notes:delete'
} as const
