import { useCallback } from 'react'
import { useMindMapStore, type MindMap } from '../store/useMindMapStore'
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
      nodes: nodes.map((n) => ({ id: n.id, data: { label: (n.data as any).label }, position: n.position })),
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
      nodes: nodes.map((n) => ({ id: n.id, data: { label: (n.data as any).label }, position: n.position })),
      edges: edges.map((e) => ({ id: e.id ?? nanoid(), source: e.source, target: e.target })),
    }
    downloadJson(map)
  }, [nodes, edges])

  return (
    <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 bg-neutral-900/70 border-b border-neutral-800">
      <div className="mx-auto max-w-screen-2xl px-4 py-3 flex items-center gap-3 text-neutral-100">
        <div className="text-lg font-semibold tracking-tight">MiniMind Editor</div>
        <div className="flex-1" />
        <button
          onClick={undo}
          className="px-3 py-1.5 rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition"
          title="Undo"
        >
          Undo
        </button>
        <button
          onClick={redo}
          className="px-3 py-1.5 rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition"
          title="Redo"
        >
          Redo
        </button>
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          className="px-3 py-1.5 rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition"
          title="Toggle grid snapping"
        >
          {snapToGrid ? 'Grid Snap: On' : 'Grid Snap: Off'}
        </button>
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition"
        >
          Add Node
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1.5 rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition"
        >
          Save
        </button>
        <button
          onClick={handleLoad}
          className="px-3 py-1.5 rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition"
        >
          Load
        </button>
        <button
          onClick={handleExport}
          className="px-3 py-1.5 rounded-md bg-sky-600 text-white hover:bg-sky-500 transition"
        >
          Export JSON
        </button>
      </div>
    </div>
  )
}


