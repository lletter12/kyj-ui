import type { DependencyList } from 'react'

export const isSameDepth = (oldDeps: DependencyList, deps: DependencyList): boolean => {
    if (oldDeps === deps) return true
    for (let i = 0; i < oldDeps.length; i++) {
        if (!Object.is(oldDeps[i], deps[i])) return false
    }
    return true
}