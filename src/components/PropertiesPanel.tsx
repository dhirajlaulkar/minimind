import { useEffect, useState } from 'react'
import { useMindMapStore, type NodeAttributes } from '../store/useMindMapStore'
import { HexColorPicker } from 'react-colorful'
import { Lock, Unlock, Trash2, Square, Circle, Hexagon, Diamond, Activity, Minus, CornerDownRight, Spline } from 'lucide-react'
import clsx from 'clsx'
import { MarkerType } from 'reactflow'

const SHAPES = [
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'diamond', icon: Diamond, label: 'Diamond' },
    { id: 'hexagon', icon: Hexagon, label: 'Hexagon' },
] as const

const EDGE_TYPES = [
    { id: 'default', label: 'Bezier', icon: Spline },
    { id: 'straight', label: 'Straight', icon: Minus },
    { id: 'step', label: 'Step', icon: CornerDownRight },
    { id: 'smoothstep', label: 'Smooth', icon: Activity },
] as const

const PRESET_COLORS = [
    '#ffffff', // White
    '#f87171', // Red
    '#fb923c', // Orange
    '#facc15', // Yellow
    '#4ade80', // Green
    '#60a5fa', // Blue
    '#c084fc', // Purple
    '#f472b6', // Pink
    '#94a3b8', // Gray
    '#000000', // Black
]

export default function PropertiesPanel() {
    const selectedNodeIds = useMindMapStore((s) => s.selectedNodeIds)
    const selectedEdgeIds = useMindMapStore((s) => s.selectedEdgeIds)
    const nodes = useMindMapStore((s) => s.nodes)
    const edges = useMindMapStore((s) => s.edges)
    const updateNodeLabel = useMindMapStore((s) => s.updateNodeLabel)
    const updateNodeStyle = useMindMapStore((s) => s.updateNodeStyle)
    const updateEdge = useMindMapStore((s) => s.updateEdge)
    const toggleLock = useMindMapStore((s) => s.toggleLock)
    const removeSelected = useMindMapStore((s) => s.removeSelected)

    const [label, setLabel] = useState('')

    // Determine what is selected
    const selectedNodeId = selectedNodeIds.size === 1 ? Array.from(selectedNodeIds)[0] : null
    const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null

    const selectedEdgeId = selectedEdgeIds.size === 1 ? Array.from(selectedEdgeIds)[0] : null
    const selectedEdge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null

    const isNodeSelected = !!selectedNode
    const isEdgeSelected = !!selectedEdge && !isNodeSelected // Prioritize node if both (shouldn't happen usually)

    useEffect(() => {
        if (selectedNode) {
            setLabel((selectedNode.data as NodeAttributes).label || '')
        } else if (selectedEdge) {
            setLabel(selectedEdge.label as string || '')
        }
    }, [selectedNodeId, selectedEdgeId, selectedNode, selectedEdge])

    if (!isNodeSelected && !isEdgeSelected) {
        return null
    }

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value)
        if (isNodeSelected && selectedNode) {
            updateNodeLabel(selectedNode.id, e.target.value)
        } else if (isEdgeSelected && selectedEdge) {
            updateEdge(selectedEdge.id, { label: e.target.value })
        }
    }

    // --- RENDER NODE PROPERTIES ---
    if (isNodeSelected && selectedNode) {
        const data = selectedNode.data as NodeAttributes
        const isLocked = !!data.locked

        return (
            <div className="absolute top-4 right-4 w-64 bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-4 flex flex-col gap-4 z-50">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-semibold text-slate-700 text-sm">Node Properties</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => toggleLock(selectedNode.id)}
                            className={clsx(
                                "p-1.5 rounded hover:bg-slate-100 transition-colors",
                                isLocked ? "text-red-500" : "text-slate-500"
                            )}
                            title={isLocked ? "Unlock Node" : "Lock Node"}
                        >
                            {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                        </button>
                        <button
                            onClick={removeSelected}
                            className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
                            title="Delete Node"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Label */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">Label</label>
                    <input
                        type="text"
                        value={label}
                        onChange={handleLabelChange}
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Shape */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">Shape</label>
                    <div className="grid grid-cols-4 gap-2">
                        {SHAPES.map((shape) => (
                            <button
                                key={shape.id}
                                onClick={() => updateNodeStyle(selectedNode.id, { shape: shape.id })}
                                className={clsx(
                                    "p-2 rounded border flex items-center justify-center transition-all",
                                    data.shape === shape.id
                                        ? "bg-blue-50 border-blue-500 text-blue-600"
                                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                )}
                                title={shape.label}
                            >
                                <shape.icon size={18} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">Color</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {PRESET_COLORS.map((c) => (
                            <button
                                key={c}
                                onClick={() => updateNodeStyle(selectedNode.id, { color: c })}
                                className={clsx(
                                    "w-6 h-6 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-110",
                                    data.color === c && "ring-2 ring-blue-500 ring-offset-1"
                                )}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <HexColorPicker
                            color={data.color || '#ffffff'}
                            onChange={(c) => updateNodeStyle(selectedNode.id, { color: c })}
                            style={{ width: '100%', height: '120px' }}
                        />
                    </div>
                </div>

                {/* Dimensions Info */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-200">
                    <div>W: {Math.round(data.size?.width || 0)}px</div>
                    <div>H: {Math.round(data.size?.height || 0)}px</div>
                </div>
            </div>
        )
    }

    // --- RENDER EDGE PROPERTIES ---
    if (isEdgeSelected && selectedEdge) {
        const edgeColor = selectedEdge.style?.stroke || '#b1b1b7'
        const isAnimated = !!selectedEdge.animated

        return (
            <div className="absolute top-4 right-4 w-64 bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-4 flex flex-col gap-4 z-50">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-semibold text-slate-700 text-sm">Connection Properties</span>
                    <button
                        onClick={removeSelected}
                        className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
                        title="Delete Connection"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Label */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">Label</label>
                    <input
                        type="text"
                        value={label}
                        onChange={handleLabelChange}
                        placeholder="Connection label..."
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Line Type */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">Line Type</label>
                    <div className="grid grid-cols-4 gap-2">
                        {EDGE_TYPES.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => updateEdge(selectedEdge.id, { type: type.id })}
                                className={clsx(
                                    "p-2 rounded border flex items-center justify-center transition-all",
                                    selectedEdge.type === type.id
                                        ? "bg-blue-50 border-blue-500 text-blue-600"
                                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                )}
                                title={type.label}
                            >
                                <type.icon size={18} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Animation */}
                <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-500">Animated</label>
                    <button
                        onClick={() => updateEdge(selectedEdge.id, { animated: !isAnimated })}
                        className={clsx(
                            "w-10 h-5 rounded-full transition-colors relative",
                            isAnimated ? "bg-blue-500" : "bg-slate-300"
                        )}
                    >
                        <div className={clsx(
                            "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform",
                            isAnimated ? "translate-x-5" : "translate-x-0"
                        )} />
                    </button>
                </div>

                {/* Color */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500">Color</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {PRESET_COLORS.map((c) => (
                            <button
                                key={c}
                                onClick={() => updateEdge(selectedEdge.id, {
                                    style: { ...selectedEdge.style, stroke: c },
                                    markerEnd: { type: MarkerType.ArrowClosed, color: c }
                                })}
                                className={clsx(
                                    "w-6 h-6 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-110",
                                    edgeColor === c && "ring-2 ring-blue-500 ring-offset-1"
                                )}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <HexColorPicker
                            color={edgeColor}
                            onChange={(c) => updateEdge(selectedEdge.id, {
                                style: { ...selectedEdge.style, stroke: c },
                                markerEnd: { type: MarkerType.ArrowClosed, color: c }
                            })}
                            style={{ width: '100%', height: '120px' }}
                        />
                    </div>
                </div>
            </div>
        )
    }

    return null
}
