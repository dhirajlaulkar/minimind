import { create } from 'zustand'
import { nanoid } from '../utils/nanoid'
import type { Edge, Node } from 'reactflow'

export interface NodeData {
  id: string
  data: { label: string }
  position: { x: number; y: number }
}

export interface EdgeData {
  id: string
  source: string
  target: string
}

export interface MindMap {
  nodes: NodeData[]
  edges: EdgeData[]
}

interface MindMapState {
  nodes: Node[]
  edges: Edge[]
  addNode: (label?: string, position?: { x: number; y: number }) => void
  updateNodeLabel: (id: string, label: string) => void
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  addEdge: (edge: Edge) => void
  loadMap: (map: MindMap) => void
  reset: () => void
}

export const useMindMapStore = create<MindMapState>((set, _get) => ({
  nodes: [
    {
      id: 'root',
      data: { label: 'Main Idea' },
      position: { x: 0, y: 0 },
      type: 'default',
    },
  ],
  edges: [],

  addNode: (label = 'New Node', position = { x: Math.random() * 400, y: Math.random() * 300 }) =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id: nanoid(),
          data: { label },
          position,
          type: 'default',
        },
      ],
    })),

  updateNodeLabel: (id, label) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, label } } : n)),
    })),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),

  loadMap: (map) => {
    const nodes: Node[] = map.nodes.map((n) => ({
      id: n.id,
      type: 'default',
      data: { label: n.data.label },
      position: n.position,
    }))
    const edges: Edge[] = map.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    }))
    set({ nodes, edges })
  },

  reset: () =>
    set({
      nodes: [
        {
          id: 'root',
          data: { label: 'Main Idea' },
          position: { x: 0, y: 0 },
          type: 'default',
        },
      ],
      edges: [],
    }),
}))


