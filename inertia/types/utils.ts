import type { DefaultColors } from '../../node_modules/tailwindcss/types/generated/colors'

type TWColorDefaults = 'inherit' | 'current' | 'transparent' | 'black' | 'white'
type TWColorKey = keyof Omit<DefaultColors, TWColorDefaults>
type TWColorTone = keyof DefaultColors[TWColorKey]
export type TWColor = `${TWColorKey}-${TWColorTone}` | TWColorDefaults
