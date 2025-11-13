import Toolbar from '../components/Toolbar'
import MindMapCanvas from '../components/MindMapCanvas'
import { useEffect } from 'react'
import { useMindMapStore } from '../store/useMindMapStore'
import { saveMap } from '../utils/storage'
import { debounce } from '../utils/debounce'

export default function Editor() {
  const nodes = useMindMapStore((s) => s.nodes)
  const edges = useMindMapStore((s) => s.edges)

  useEffect(() => {
    const run = debounce(() => {
      saveMap({
        nodes: nodes.map((n) => ({ id: n.id, data: { label: (n.data as any).label }, position: n.position })),
        edges: edges.map((e) => ({ id: e.id!, source: e.source, target: e.target })),
      })
    }, 600)
    run()
  }, [nodes, edges])

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#FDE047] text-black">
      <Toolbar />
      <div className="flex-1 px-6 pb-8 pt-6 md:px-10">
        <div className="h-full border-4 border-black bg-white shadow-[12px_12px_0_#000]">
          <MindMapCanvas />
        </div>
      </div>
    </div>
  )
}
