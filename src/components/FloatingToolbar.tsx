import { useCallback } from 'react'
import { useMindMapStore, type MindMap } from '../store/useMindMapStore'
import { saveMap, loadMap } from '../utils/storage'
import { downloadJson } from '../utils/export'
import { nanoid } from '../utils/nanoid'
import { useReactFlow } from 'reactflow'
import {
    Plus,
    Undo,
    Redo,
    Download,
    Upload,
    Save,
    ZoomIn,
    ZoomOut,
    Maximize,
    LayoutGrid,
    Trash2,
} from 'lucide-react'
import clsx from 'clsx'

export default function FloatingToolbar() {
    const nodes = useMindMapStore((s) => s.nodes)
    const edges = useMindMapStore((s) => s.edges)
    const addNode = useMindMapStore((s) => s.addNode)
    const load = useMindMapStore((s) => s.loadMap)
    const undo = useMindMapStore((s) => s.undo)
    const redo = useMindMapStore((s) => s.redo)
    const snapToGrid = useMindMapStore((s) => s.snapToGrid)
    const setSnapToGrid = useMindMapStore((s) => s.setSnapToGrid)
    const removeSelected = useMindMapStore((s) => s.removeSelected)

    const { zoomIn, zoomOut, fitView, screenToFlowPosition } = useReactFlow()

    const handleAdd = useCallback(() => {
        // Add node at the center of the visible area
        // We use window dimensions as a proxy for the viewport since the editor is full screen
        const center = screenToFlowPosition({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        })

        // Add a slight random offset so multiple nodes don't stack perfectly
        const position = {
            x: center.x + (Math.random() * 40 - 20),
            y: center.y + (Math.random() * 40 - 20)
        }

        addNode('New Node', position)
    }, [addNode, screenToFlowPosition])

    const handleSave = useCallback(() => {
        const map: MindMap = {
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
            edges: edges.map((e) => ({ id: e.id ?? nanoid(), source: e.source, target: e.target })),
        }
        downloadJson(map)
    }, [nodes, edges])

    const btnClass = "p-2 rounded-lg hover:bg-white/20 transition-colors text-slate-700 hover:text-slate-900 active:scale-95"
    const separator = "w-px h-6 bg-slate-300 mx-1"

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl z-50">
            <button onClick={handleAdd} className={btnClass} title="Add Node">
                <Plus size={20} />
            </button>
            <button onClick={removeSelected} className={btnClass} title="Delete Selected">
                <Trash2 size={20} />
            </button>

            <div className={separator} />

            <button onClick={undo} className={btnClass} title="Undo">
                <Undo size={20} />
            </button>
            <button onClick={redo} className={btnClass} title="Redo">
                <Redo size={20} />
            </button>

            <div className={separator} />

            <button onClick={() => zoomIn()} className={btnClass} title="Zoom In">
                <ZoomIn size={20} />
            </button>
            <button onClick={() => zoomOut()} className={btnClass} title="Zoom Out">
                <ZoomOut size={20} />
            </button>
            <button onClick={() => fitView()} className={btnClass} title="Fit View">
                <Maximize size={20} />
            </button>

            <div className={separator} />

            <button
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={clsx(btnClass, snapToGrid && "bg-blue-100/50 text-blue-600")}
                title="Toggle Grid Snap"
            >
                <LayoutGrid size={20} />
            </button>

            <div className={separator} />

            <button onClick={handleSave} className={btnClass} title="Save to LocalStorage">
                <Save size={20} />
            </button>
            <button onClick={handleLoad} className={btnClass} title="Load from LocalStorage">
                <Upload size={20} />
            </button>
            <button onClick={handleExport} className={btnClass} title="Export JSON">
                <Download size={20} />
            </button>
        </div>
    )
}
