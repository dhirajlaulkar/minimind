import { BaseEdge, type EdgeProps } from 'reactflow'
import type { CSSProperties } from 'react'

export default function RoundedEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  markerStart,
  style,
}: EdgeProps) {
  const midX = sourceX + (targetX - sourceX) / 2
  const path = `M ${sourceX},${sourceY} L ${midX},${sourceY} L ${midX},${targetY} L ${targetX},${targetY}`
  const edgeStyle: CSSProperties = {
    ...(style ?? {}),
    strokeLinecap: 'square',
    strokeLinejoin: 'miter',
  }

  return <BaseEdge path={path} markerEnd={markerEnd} markerStart={markerStart} style={edgeStyle} />
}

