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
    <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/50 bg-white/70 border-b border-neutral-200">
      <div className="mx-auto max-w-screen-2xl px-4 py-3 flex items-center gap-3">
        <div className="text-lg font-semibold tracking-tight">MiniMind Editor</div>
        <div className="flex-1" />
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 rounded-md border border-neutral-300 bg-white hover:bg-neutral-100 transition"
        >
          Add Node
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1.5 rounded-md border border-neutral-300 bg-white hover:bg-neutral-100 transition"
        >
          Save
        </button>
        <button
          onClick={handleLoad}
          className="px-3 py-1.5 rounded-md border border-neutral-300 bg-white hover:bg-neutral-100 transition"
        >
          Load
        </button>
        <button
          onClick={handleExport}
          className="px-3 py-1.5 rounded-md bg-black text-white hover:bg-neutral-800 transition"
        >
          Export JSON
        </button>
      </div>
    </div>
  )
}


