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
    <div className="relative h-screen w-full flex flex-col bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 right-[-200px] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-sky-900/30 via-indigo-900/20 to-purple-900/10 blur-3xl opacity-60" />
      </div>
      <Toolbar />
      <div className="flex-1">
        <MindMapCanvas />
      </div>
    </div>
  )
}


