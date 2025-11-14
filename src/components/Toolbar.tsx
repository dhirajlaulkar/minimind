import { useCallback } from 'react'
import { useMindMapStore, type MindMap, type NodeSize } from '../store/useMindMapStore'
import { saveMap, loadMap } from '../utils/storage'
import { downloadJson } from '../utils/export'
import { nanoid } from '../utils/nanoid'

export default function Toolbar() {
  const nodes = useMindMapStore((s) => s.nodes)
  const edges = useMindMapStore((s) => s.edges)
  const addNode = useMindMapStore((s) => s.addNode)
  const load = useMindMapStore((s) => s.loadMap)
  const undo = useMindMapStore((s) => s.undo)
  const redo = useMindMapStore((s) => s.redo)
  const snapToGrid = useMindMapStore((s) => s.snapToGrid)
  const setSnapToGrid = useMindMapStore((s) => s.setSnapToGrid)

  const handleAdd = useCallback(() => {
    addNode()
  }, [addNode])

  const handleSave = useCallback(() => {
    const map: MindMap = {
      nodes: nodes.map((n) => {
        const data = n.data as { label?: string; size?: NodeSize }
        return {
          id: n.id,
          data: {
            label: data.label ?? '',
            size: data.size,
          },
          position: n.position,
        }
      }),
      edges: edges.map((e) => ({ id: e.id ?? nanoid(), source: e.source, target: e.target })),
    }
    saveMap(map)
  }, [nodes, edges])

  const handleLoad = useCallback(() => {
    const map = loadMap()
    if (map) load(map)
  }, [load])

  const handleExport = useCallback(() => {
    const map: MindMap = {
      nodes: nodes.map((n) => {
        const data = n.data as { label?: string; size?: NodeSize }
        return {
          id: n.id,
          data: {
            label: data.label ?? '',
            size: data.size,
          },
          position: n.position,
        }
      }),
      edges: edges.map((e) => ({ id: e.id ?? nanoid(), source: e.source, target: e.target })),
    }
    downloadJson(map)
  }, [nodes, edges])

  const buttonBase = 'editor-btn'

  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar-title">Editor</div>
      <button onClick={undo} className={buttonBase} title="Undo">Undo</button>
      <button onClick={redo} className={buttonBase} title="Redo">Redo</button>
      <button onClick={() => setSnapToGrid(!snapToGrid)} className={buttonBase} title="Toggle grid snapping">
        {snapToGrid ? 'Snap: On' : 'Snap: Off'}
      </button>
      <button onClick={handleAdd} className={`${buttonBase} primary`}>Add</button>
      <button onClick={handleSave} className={buttonBase}>Save</button>
      <button onClick={handleLoad} className={buttonBase}>Load</button>
      <button onClick={handleExport} className={buttonBase}>Export</button>
    </div>
  )
}
