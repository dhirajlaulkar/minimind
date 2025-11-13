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

  const buttonBase =
    'px-4 py-3 border-4 border-black uppercase font-black tracking-tightest shadow-[4px_4px_0_#000] transition-transform duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] text-xs md:text-sm'

  return (
    <div className="sticky top-0 z-30 border-b-4 border-black bg-white shadow-[8px_8px_0_#000]">
      <div className="mx-auto max-w-screen-2xl px-6 py-4 flex flex-wrap items-center gap-3 text-black uppercase font-black tracking-tightest">
        <div className="text-lg md:text-2xl">MiniMind Control Deck</div>
        <div className="flex-1" />
        <button onClick={undo} className={`${buttonBase} bg-white`} title="Undo">
          Undo
        </button>
        <button onClick={redo} className={`${buttonBase} bg-white`} title="Redo">
          Redo
        </button>
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          className={`${buttonBase} ${snapToGrid ? 'bg-[#22D3EE]' : 'bg-white'}`}
          title="Toggle grid snapping"
        >
          {snapToGrid ? 'Grid Snap On' : 'Grid Snap Off'}
        </button>
        <button onClick={handleAdd} className={`${buttonBase} bg-[#F472B6]`}>
          Add Node
        </button>
        <button onClick={handleSave} className={`${buttonBase} bg-white`}>
          Save
        </button>
        <button onClick={handleLoad} className={`${buttonBase} bg-white`}>
          Load
        </button>
        <button onClick={handleExport} className={`${buttonBase} bg-[#FDE047]`}>
          Export JSON
        </button>
      </div>
    </div>
  )
}
