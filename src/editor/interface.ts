import { CSSProperties } from 'vue'

export interface CommonComponentProps {
    id: number
    name: string
    title?: string
    url?: string
    onFinish?: any
    styles: CSSProperties
    [key: string]: any
}
