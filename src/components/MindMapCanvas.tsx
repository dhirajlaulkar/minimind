import { useCallback, useEffect, useMemo } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge as rfAddEdge,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  MarkerType,
  ConnectionMode,
  ConnectionLineType,
  SelectionMode,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useMindMapStore } from '../store/useMindMapStore'
import NodeEditor from './NodeEditor'
import { applyNodeChanges, applyEdgeChanges } from 'reactflow'
import RoundedEdge from './edges/RoundedEdge'

const nodeTypes = { default: NodeEditor }
const edgeTypes = { rounded: RoundedEdge }

export default function MindMapCanvas() {
  const nodes = useMindMapStore((s) => s.nodes)
  const edges = useMindMapStore((s) => s.edges)
  const setNodes = useMindMapStore((s) => s.setNodes)
  const setEdges = useMindMapStore((s) => s.setEdges)
  const addEdgeStore = useMindMapStore((s) => s.addEdge)
  const setSelection = useMindMapStore((s) => s.setSelection)
  const removeSelected = useMindMapStore((s) => s.removeSelected)
  const pushHistory = useMindMapStore((s) => s.pushHistory)
  const snapToGrid = useMindMapStore((s) => s.snapToGrid)

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      pushHistory()
      const newEdge = rfAddEdge(connection as any, [])
      if (Array.isArray(newEdge)) {
        // rfAddEdge returns updated edges when provided existing edges; with []
        // it returns a new edge array of size 1
        addEdgeStore(newEdge[0] as Edge)
      }
    },
    [addEdgeStore, pushHistory],
  )

  const rfProps = useMemo(
    () => ({
      nodes,
      edges,
      nodeTypes,
      edgeTypes,
      defaultEdgeOptions: {
        type: 'rounded',
        animated: false,
        style: { stroke: '#38bdf8', strokeWidth: 2, strokeDasharray: '6 6' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#38bdf8',
          width: 18,
          height: 18,
        },
      },
      connectionLineType: ConnectionLineType.SmoothStep,
      connectionLineStyle: { stroke: '#38bdf8', strokeWidth: 2 },
      onNodesChange: (changes: any[]) => {
        const shouldRecord = (changes as any[]).some((c) => {
          if (c.type === 'select' || c.type === 'dimensions') return false
          if (c.type === 'position') return c.dragging === false
          return true
        })
        if (shouldRecord) {
          pushHistory()
        }
        setNodes(applyNodeChanges(changes, nodes as Node[]))
      },
      onEdgesChange: (changes: any[]) => {
        const shouldRecord = (changes as any[]).some((c) => c.type !== 'select')
        if (shouldRecord) {
          pushHistory()
        }
        setEdges(applyEdgeChanges(changes, edges as Edge[]))
      },
      onSelectionChange: (sel: { nodes: Node[]; edges: Edge[] }) => {
        setSelection(sel.nodes.map((n) => n.id), sel.edges.map((e) => e.id))
      },
      onConnect,
      connectionMode: ConnectionMode.Loose,
      isValidConnection: (conn: any) => conn.source !== conn.target,
      fitView: true,
      fitViewOptions: { padding: 0.2 },
      panOnDrag: true,
      zoomOnScroll: true,
      panOnScroll: true,
      elevateEdgesOnSelect: true,
      selectionOnDrag: true,
      selectionMode: SelectionMode.Partial,
      snapToGrid,
      snapGrid: [24, 24] as [number, number],
    }),
    [nodes, edges, onConnect, setNodes, setEdges, setSelection, snapToGrid, pushHistory],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isEditable =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          (target as HTMLElement).isContentEditable)
      if (isEditable) return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        removeSelected()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [removeSelected])

  return (
    <div className="w-full h-full">
      <ReactFlow {...rfProps}>
        <MiniMap />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#334155" className="bg-neutral-950" />
      </ReactFlow>
    </div>
  )
}


