import Toolbar from '../components/Toolbar'
import MindMapCanvas from '../components/MindMapCanvas'
import { useEffect } from 'react'
import { useMindMapStore, type NodeSize } from '../store/useMindMapStore'
import { saveMap } from '../utils/storage'
import { debounce } from '../utils/debounce'
import '../editor.css'

export default function Editor() {
  const nodes = useMindMapStore((s) => s.nodes)
  const edges = useMindMapStore((s) => s.edges)

  useEffect(() => {
    const run = debounce(() => {
      saveMap({
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
        edges: edges.map((e) => ({ id: e.id!, source: e.source, target: e.target })),
      })
    }, 600)
    run()
  }, [nodes, edges])

  return (
    <div className="simple-editor h-screen w-full flex flex-col">
      <Toolbar />
      <div className="flex-1 p-4 flex">
        <div className="editor-surface flex-1">
          <MindMapCanvas />
        </div>
      </div>
    </div>
  )
}
