import MindMapCanvas from '../components/MindMapCanvas'
import FloatingToolbar from '../components/FloatingToolbar'
import PropertiesPanel from '../components/PropertiesPanel'
import { useEffect } from 'react'
import { useMindMapStore } from '../store/useMindMapStore'
import { saveMap } from '../utils/storage'
import { debounce } from '../utils/debounce'
import { ReactFlowProvider } from 'reactflow'
import '../editor.css'

export default function Editor() {
  const nodes = useMindMapStore((s) => s.nodes)
  const edges = useMindMapStore((s) => s.edges)

  useEffect(() => {
    const run = debounce(() => {
      saveMap({
        nodes: nodes.map((n) => {
          const data = n.data as any
          return {
            id: n.id,
            data: {
              label: data.label ?? '',
              size: data.size,
              color: data.color,
              shape: data.shape,
              locked: data.locked,
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
    <ReactFlowProvider>
      <div className="relative h-screen w-full overflow-hidden bg-slate-50">
        <MindMapCanvas />
        <FloatingToolbar />
        <PropertiesPanel />
      </div>
    </ReactFlowProvider>
  )
}
