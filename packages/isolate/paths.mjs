import { existsSync, lstatSync } from 'fs'
import { sep, normalize, join } from 'path'

const configName = 'lerna.json'

export async function findRoot (start) {
  start = start || module.parent.filename
  if (typeof start === 'string') {
    if (start[start.length - 1] !== sep) {
      start += sep
    }
    start = normalize(start)
    start = start.split(sep)
  }
  if (!start.length) {
    throw new Error('Could not find lerna root')
  }
  start.pop()
  const dir = start.join(sep)
  const fullPath = join(dir, configName)
  if (existsSync(fullPath)) {
    if (!lstatSync(fullPath).isDirectory()) {
      return dir
    }
    return normalize(fullPath)
  } else {
    return findRoot(start)
  }
}
