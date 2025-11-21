import { create } from 'zustand'
import { nanoid } from '../utils/nanoid'
import type { Edge, Node } from 'reactflow'

export interface NodeSize {
  width: number
  height: number
}

export interface NodeAttributes {
  label: string
  size?: NodeSize
  color?: string
  shape?: 'rectangle' | 'circle' | 'diamond' | 'hexagon'
  locked?: boolean
}

export interface NodeData {
  id: string
  data: NodeAttributes
  position: { x: number; y: number }
}

export interface EdgeData {
  id: string
  source: string
  target: string
  label?: string
  type?: string
  animated?: boolean
  style?: any
}

export interface MindMap {
  nodes: NodeData[]
  edges: EdgeData[]
}

interface MindMapState {
  nodes: Node[]
  edges: Edge[]
  // selection
  selectedNodeIds: Set<string>
  selectedEdgeIds: Set<string>
  // history
  past: MindMap[]
  future: MindMap[]
  pushHistory: () => void
  undo: () => void
  redo: () => void
  // editor settings
  snapToGrid: boolean
  setSnapToGrid: (value: boolean) => void
  addNode: (label?: string, position?: { x: number; y: number }) => void
  updateNodeLabel: (id: string, label: string) => void
  updateNodeStyle: (id: string, style: Partial<NodeAttributes>) => void
  updateEdge: (id: string, data: Partial<Edge>) => void
  toggleLock: (id: string) => void
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  addEdge: (edge: Edge) => void
  setSelection: (nodeIds: string[], edgeIds: string[]) => void
  removeSelected: () => void
  duplicateSelected: () => void
  loadMap: (map: MindMap) => void
  reset: () => void
  setNodeSize: (id: string, size: NodeSize) => void
}

const DEFAULT_NODE_SIZE: NodeSize = { width: 180, height: 56 }

const toSnapshot = (nodes: Node[], edges: Edge[]): MindMap => ({
  nodes: nodes.map((n) => ({
    id: n.id,
    data: {
      label: (n.data as NodeAttributes).label ?? '',
      size: (n.data as NodeAttributes).size,
      color: (n.data as NodeAttributes).color,
      shape: (n.data as NodeAttributes).shape,
      locked: (n.data as NodeAttributes).locked,
    },
    position: { ...n.position },
  })),
  edges: edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label as string,
    type: e.type,
    animated: e.animated,
    style: e.style,
  })),
})

const fromSnapshot = (map: MindMap): { nodes: Node[]; edges: Edge[] } => ({
  nodes: map.nodes.map((n) => ({
    id: n.id,
    type: 'default',
    data: {
      label: n.data.label,
      size: n.data.size ?? DEFAULT_NODE_SIZE,
      color: n.data.color,
      shape: n.data.shape,
      locked: n.data.locked,
    },
    position: { ...n.position },
    draggable: !n.data.locked,
  })),
  edges: map.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: e.type ?? 'rounded',
    label: e.label,
    animated: e.animated,
    style: e.style,
    markerEnd: { type: 'arrowclosed' as any },
  })),
})

export const useMindMapStore = create<MindMapState>((set, get) => ({
  nodes: [
    {
      id: 'root',
      data: { label: 'Main Idea', size: DEFAULT_NODE_SIZE },
      position: { x: 0, y: 0 },
      type: 'default',
    },
  ],
  edges: [],
  selectedNodeIds: new Set<string>(),
  selectedEdgeIds: new Set<string>(),
  past: [],
  future: [],
  snapToGrid: false,
  setSnapToGrid: (value) => set({ snapToGrid: value }),

  pushHistory: () => {
    const { nodes, edges, past } = get()
    const snapshot = toSnapshot(nodes, edges)
    const nextPast = [...past, snapshot].slice(-50)
    set({ past: nextPast, future: [] })
  },

  undo: () => {
    const { past, future, nodes, edges } = get()
    if (past.length === 0) return
    const current = toSnapshot(nodes, edges)
    const prev = past[past.length - 1]
    const restored = fromSnapshot(prev)
    set({
      nodes: restored.nodes,
      edges: restored.edges,
      past: past.slice(0, -1),
      future: [current, ...future].slice(0, 50),
      selectedNodeIds: new Set(),
      selectedEdgeIds: new Set(),
    })
  },

  redo: () => {
    const { future, past, nodes, edges } = get()
    if (future.length === 0) return
    const current = toSnapshot(nodes, edges)
    const next = future[0]
    const restored = fromSnapshot(next)
    set({
      nodes: restored.nodes,
      edges: restored.edges,
      past: [...past, current].slice(-50),
      future: future.slice(1),
      selectedNodeIds: new Set(),
      selectedEdgeIds: new Set(),
    })
  },

  addNode: (label = 'New Node', position = { x: Math.random() * 400, y: Math.random() * 300 }) => {
    get().pushHistory()
    set((state) => {
      const newNode: Node = {
        id: nanoid(),
        data: { label, size: DEFAULT_NODE_SIZE },
        position,
        type: 'default',
      }
      return { nodes: [...state.nodes, newNode] }
    })
  },

  updateNodeLabel: (id, label) => {
    const current = get().nodes.find((n) => n.id === id)
    const existing = current ? (current.data as NodeAttributes).label : undefined
    if (existing === label) return
    get().pushHistory()
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id
          ? {
            ...n,
            data: {
              ...(n.data as NodeAttributes),
              label,
            },
          }
          : n,
      ),
    }))
  },

  setNodes: (nodes) => {
    set({ nodes })
  },
  setEdges: (edges) => {
    set({ edges })
  },
  addEdge: (edge) =>
    set((state) => ({
      edges: [
        ...state.edges,
        {
          ...edge,
          type: edge.type ?? 'rounded',
          markerEnd: { type: 'arrowclosed' as any },
        },
      ],
    })),

  setSelection: (nodeIds, edgeIds) => {
    set({
      selectedNodeIds: new Set(nodeIds),
      selectedEdgeIds: new Set(edgeIds),
    })
  },

  removeSelected: () => {
    const { selectedNodeIds, selectedEdgeIds } = get()
    if (selectedNodeIds.size === 0 && selectedEdgeIds.size === 0) return
    get().pushHistory()
    set((state) => {
      const nodes = state.nodes.filter((n) => !state.selectedNodeIds.has(n.id))
      const edges = state.edges.filter(
        (e) =>
          !state.selectedEdgeIds.has(e.id) &&
          !state.selectedNodeIds.has(e.source) &&
          !state.selectedNodeIds.has(e.target),
      )
      return { nodes, edges, selectedNodeIds: new Set(), selectedEdgeIds: new Set() }
    })
  },

  duplicateSelected: () => {
    const { selectedNodeIds } = get()
    if (selectedNodeIds.size === 0) return
    get().pushHistory()
    set((state) => {
      const toDuplicate = state.nodes.filter((n) => state.selectedNodeIds.has(n.id))
      const clones: Node[] = toDuplicate.map((n) => ({
        ...n,
        id: nanoid(),
        position: { x: n.position.x + 24, y: n.position.y + 24 },
        data: { ...(n.data as NodeAttributes) },
      }))
      return { nodes: [...state.nodes, ...clones] }
    })
  },

  loadMap: (map) => {
    get().pushHistory()
    const { nodes, edges } = fromSnapshot(map)
    set({ nodes, edges })
  },

  reset: () =>
    set({
      nodes: [
        {
          id: 'root',
          data: { label: 'Main Idea', size: DEFAULT_NODE_SIZE },
          position: { x: 0, y: 0 },
          type: 'default',
        },
      ],
      edges: [],
      selectedNodeIds: new Set(),
      selectedEdgeIds: new Set(),
      past: [],
      future: [],
    }),

  updateNodeStyle: (id, style) => {
    const current = get().nodes.find((n) => n.id === id)
    if (!current) return
    const currentData = current.data as NodeAttributes

    // Check if any value actually changed
    const hasChanges = Object.entries(style).some(
      ([key, value]) => currentData[key as keyof NodeAttributes] !== value
    )
    if (!hasChanges) return

    get().pushHistory()
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id
          ? {
            ...n,
            data: {
              ...currentData,
              ...style,
            },
          }
          : n,
      ),
    }))
  },

  updateEdge: (id, data) => {
    get().pushHistory()
    set((state) => ({
      edges: state.edges.map((e) => (e.id === id ? { ...e, ...data } : e)),
    }))
  },

  toggleLock: (id) => {
    get().pushHistory()
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id
          ? {
            ...n,
            draggable: !!(n.data as NodeAttributes).locked, // If currently locked (true), draggable becomes true.
            data: {
              ...(n.data as NodeAttributes),
              locked: !(n.data as NodeAttributes).locked,
            },
          }
          : n,
      ),
    }))
  },

  setNodeSize: (id, size) => {
    const { nodes, pushHistory } = get()
    const target = nodes.find((n) => n.id === id)
    if (!target) return
    const currentSize = (target.data as NodeAttributes).size
    const normalized = {
      width: Math.round(size.width),
      height: Math.round(size.height),
    }
    if (currentSize && currentSize.width === normalized.width && currentSize.height === normalized.height) return
    pushHistory()
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id
          ? {
            ...n,
            data: {
              ...(n.data as any),
              size: normalized,
            },
          }
          : n,
      ),
    }))
  },
}))
