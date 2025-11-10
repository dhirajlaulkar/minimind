import type { MindMap } from '../store/useMindMapStore'

const STORAGE_KEY = 'minimind'

export const saveMap = (map: MindMap) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export const loadMap = (): MindMap | null => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? (JSON.parse(data) as MindMap) : null
}


