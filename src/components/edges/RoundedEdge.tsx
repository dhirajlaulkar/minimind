import { BaseEdge, type EdgeProps, Position } from 'reactflow'

const OFFSET = 80

const getControlOffset = (position: Position | undefined) => {
  switch (position) {
    case Position.Left:
      return { x: -OFFSET, y: 0 }
    case Position.Right:
      return { x: OFFSET, y: 0 }
    case Position.Top:
      return { x: 0, y: -OFFSET }
    case Position.Bottom:
      return { x: 0, y: OFFSET }
    default:
      return { x: 0, y: 0 }
  }
}

export default function RoundedEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  markerStart,
  style,
}: EdgeProps) {
  const sourceOffset = getControlOffset(sourcePosition)
  const targetOffset = getControlOffset(targetPosition)

  const c1x = sourceX + sourceOffset.x
  const c1y = sourceY + sourceOffset.y
  const c2x = targetX + targetOffset.x
  const c2y = targetY + targetOffset.y

  const path = `M ${sourceX},${sourceY} C ${c1x},${c1y} ${c2x},${c2y} ${targetX},${targetY}`

  return <BaseEdge path={path} markerEnd={markerEnd} markerStart={markerStart} style={style} />
}


