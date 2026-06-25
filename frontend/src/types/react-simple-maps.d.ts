declare module 'react-simple-maps' {
  import type { ReactNode, CSSProperties } from 'react'

  export interface Geography {
    rsmKey: string
    properties: Record<string, string>
  }

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, number>
    width?: number
    height?: number
    style?: CSSProperties
    children?: ReactNode
  }

  export interface GeographyProps {
    geography: Geography
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: Record<string, CSSProperties>
    onMouseEnter?: (event: React.MouseEvent) => void
    onMouseMove?: (event: React.MouseEvent) => void
    onMouseLeave?: () => void
    onClick?: () => void
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element
  export function ZoomableGroup(props: {
    center?: [number, number]
    zoom?: number
    children?: ReactNode
  }): JSX.Element

  export function Geographies(props: {
    geography: string | object
    children: (args: { geographies: Geography[] }) => ReactNode
  }): JSX.Element

  export function Geography(props: GeographyProps): JSX.Element
}
