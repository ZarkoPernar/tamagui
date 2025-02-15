import { getConfig } from '../config.js'
import { Shorthands } from '../types.js'

export function getExpandedShorthands<A extends Object>(
  props: A
): Omit<A, keyof Shorthands> {
  const shorthands = getConfig().shorthands
  if (!shorthands) return props
  const res = {} as A
  for (const key in props) {
    // @ts-ignore
    res[shorthands[key] || key] = props[key]
  }
  return res
}
