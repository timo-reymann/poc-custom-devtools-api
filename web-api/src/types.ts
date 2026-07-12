import type { ButtonDescriptor } from './elements/button'
import type { HeadingDescriptor } from './elements/heading'
import type { InputDescriptor } from './elements/input'
import type { DropdownDescriptor } from './elements/dropdown'
import type { TableDescriptor } from './elements/table'
import type { ToggleDescriptor } from './elements/toggle'
import type { SliderDescriptor } from './elements/slider'

export type ElementDescriptor =
  | ButtonDescriptor
  | HeadingDescriptor
  | InputDescriptor
  | DropdownDescriptor
  | TableDescriptor
  | ToggleDescriptor
  | SliderDescriptor

export interface DevToolsTab {
  label: string
  elements: ElementDescriptor[]
}

export interface DevToolsConfig {
  tabs: DevToolsTab[]
}
