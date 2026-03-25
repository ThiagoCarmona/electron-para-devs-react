# Lição 03 — React no Renderer

> Nesta lição vamos construir a interface do app de notas usando componentes React com estilo.

## O que mudou desde a lição 02

```bash
git diff lesson-02..lesson-03 --stat
```

Arquivos novos:
- `src/renderer/src/types.ts` — Interface `Note`
- `src/renderer/src/components/NoteList.tsx` — Lista de notas na sidebar
- `src/renderer/src/components/NoteEditor.tsx` — Editor de nota
- `src/renderer/src/styles/global.css` — Estilos do app

Arquivos modificados:
- `src/renderer/src/App.tsx` — Layout com sidebar + editor

## A interface

O app agora tem um layout de duas colunas:

```
┌─────────────┬───────────────────────┐
│  Sidebar    │  Editor                 │
│             │                         │
│  [Nota 1]   │  Título da nota          │
│  [Nota 2]   │  Editado em 25/03/2026   │
│  [Nota 3]   │                         │
│             │  Conteúdo da nota...     │
│  [+ Nova]   │                         │
└─────────────┴───────────────────────┘
```

## Decisões de design

### Por que CSS puro?

Usamos CSS puro em vez de Tailwind, styled-components, ou CSS modules. Razões:

1. Menos dependências para instalar e configurar
2. O foco do curso é Electron, não estilização
3. Mais fácil de entender sem conhecimento extra

Você pode trocar para o que preferir no seu projeto real.

### Por que notas em memória?

As notas ainda são `useState` com dados hardcoded. Se você recarregar o app, perde tudo. Isso é proposital — na lição 04 vamos mover os dados para o main process, e na 05 vamos persistí-los com SQLite.

## Os componentes

### `types.ts` — A interface Note

```ts
export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}
```

Simpls e direto. Usa `string` para datas (ISO 8601) porque JSON não tem tipo Date.

### `NoteList` — A sidebar

Recebe as notas e callbacks. Cada item mostra título e preview do conteúdo. O botão de excluir usa `e.stopPropagation()` para não selecionar a nota ao clicar.

### `NoteEditor` — O editor

Usa estado local (`useState`) para título e conteúdo, sincronizando com a nota selecionada via `useEffect` quando `note.id` muda. Cada digitação chama `onUpdate` para manter o estado do App sincronizado.

### `App` — O orquestrador

O `App` mantém o estado das notas e a nota selecionada. Ele passa callbacks para os filhos: `onSelect`, `onUpdate`, `onCreate`, `onDelete`.

## Padrões React aplicados aqui

- **Lifting state up**: O estado vive no `App` e os filhos recebem via props
- **Controlled components**: Os inputs do editor são controlados pelo estado
- **Key prop**: A lista usa `note.id` como key para reconciliação eficiente
- **Event delegation**: `stopPropagation` no botão de excluir

## Teste seu entendimento

1. Por que o `NoteEditor` tem seu próprio `useState` se o estado já está no `App`?
2. O que acontece se você não passar `key` na lista de notas?
3. Por que usamos `note.id` no `useEffect` do editor em vez do objeto `note` inteiro?

<details>
<summary>Ver respostas</summary>

1. Para que a digitação seja responsiva. Se dependesse só do estado do App, cada tecla causaria re-render da árvore inteira. O estado local do editor atualiza rápido e propaga para o App.
2. O React não conseguiria saber qual item mudou, adicionou ou removeu. Poderia causar bugs visuais e problemas de performance.
3. Porque queremos resetar o editor só quando o usuário troca de nota, não quando o conteúdo muda. Se usássemos `note`, o `useEffect` rodaria a cada digitação.

</details>

## Desafio

Adicione uma barra de busca no topo da sidebar que filtra as notas por título. Use `useState` para o termo de busca e `filter` para filtrar a lista.

## Próxima lição

```bash
git checkout lesson-04
npm install
```

Na lição 04, vamos mover os dados das notas para o main process e criar handlers IPC para o CRUD completo.
