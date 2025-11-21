import { useCallback, useEffect, useMemo } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,

  MiniMap,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  type NodeChange,
  type EdgeChange,
  type OnSelectionChangeParams,
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
    (params: Connection) => {
      // Push history before adding edge
      pushHistory()
      addEdgeStore({ ...params, type: 'rounded', markerEnd: { type: MarkerType.ArrowClosed } } as Edge)
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
        style: { stroke: '#2563eb', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#2563eb',
          width: 14,
          height: 14,
        },
      },
      connectionLineType: ConnectionLineType.Straight,
      connectionLineStyle: { stroke: '#2563eb', strokeWidth: 2 },
      onConnect,
      onNodesChange: (changes: NodeChange[]) => {
        // We need to be careful not to push history on every drag frame
        // React Flow handles the drag state, we just sync it
        // For now, we rely on the store's setNodes to update state
        // A better approach for history on drag end would be to use onNodeDragStop
        setNodes(applyNodeChanges(changes, nodes as Node[]))
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        setEdges(applyEdgeChanges(changes, edges as Edge[]))
      },
      onNodeDragStart: () => {
        // Capture state before drag starts
        useMindMapStore.getState().pushHistory()
      },
      onSelectionChange: (sel: OnSelectionChangeParams) => {
        setSelection(sel.nodes.map((n) => n.id), sel.edges.map((e) => e.id))
      },
      connectionMode: ConnectionMode.Loose,
      isValidConnection: (conn: Connection) => conn.source !== conn.target,
      fitView: true,
      fitViewOptions: { padding: 0.2 },
      panOnDrag: true,
      zoomOnScroll: true,
      panOnScroll: true,
      elevateEdgesOnSelect: true,
      selectionOnDrag: true,
      selectionMode: SelectionMode.Partial,
      snapToGrid,
      snapGrid: [32, 32] as [number, number],
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
      <ReactFlow {...rfProps} minZoom={0.1} maxZoom={4}>
        <MiniMap className="!bg-white !border-slate-200 !rounded-lg !shadow-lg" />
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#cbd5e1" />
      </ReactFlow>
    </div>
  )
}
