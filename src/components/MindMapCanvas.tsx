import { useCallback, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge as rfAddEdge,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useMindMapStore } from '../store/useMindMapStore'
import NodeEditor from './NodeEditor'

const nodeTypes = { default: NodeEditor }

export default function MindMapCanvas() {
  const nodes = useMindMapStore((s) => s.nodes)
  const edges = useMindMapStore((s) => s.edges)
  const setNodes = useMindMapStore((s) => s.setNodes)
  const setEdges = useMindMapStore((s) => s.setEdges)
  const addEdgeStore = useMindMapStore((s) => s.addEdge)

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const newEdge = rfAddEdge(connection as any, [])
      if (Array.isArray(newEdge)) {
        // rfAddEdge returns updated edges when provided existing edges; with []
        // it returns a new edge array of size 1
        addEdgeStore(newEdge[0] as Edge)
      }
    },
    [addEdgeStore],
  )

  const rfProps = useMemo(
    () => ({
      nodes,
      edges,
      nodeTypes,
      onNodesChange: (changes: any) => {
        const updated = (changes as any[]).reduce((acc: Node[], change: any) => {
          if (change.type === 'position' && change.dragging !== undefined) {
            return acc.map((n) =>
              n.id === change.id ? { ...n, position: { x: change.position.x, y: change.position.y } } : n,
            )
          }
          if (change.type === 'remove') {
            return acc.filter((n) => n.id !== change.id)
          }
          return acc
        }, nodes)
        setNodes(updated)
      },
      onEdgesChange: (changes: any) => {
        const updated = (changes as any[]).reduce((acc: Edge[], change: any) => {
          if (change.type === 'remove') {
            return acc.filter((e) => e.id !== change.id)
          }
          return acc
        }, edges)
        setEdges(updated)
      },
      onConnect,
      fitView: true,
      panOnDrag: true,
      zoomOnScroll: true,
      panOnScroll: true,
      elevateEdgesOnSelect: true,
    }),
    [nodes, edges, onConnect, setNodes, setEdges],
  )

  return (
    <div className="w-full h-full">
      <ReactFlow {...rfProps}>
        <MiniMap />
        <Controls />
        <Background className="bg-neutral-50" />
      </ReactFlow>
    </div>
  )
}


