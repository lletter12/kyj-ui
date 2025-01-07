import {usePrevious} from "../usePrevious/usePrevious.ts"
import {useEffect} from "react"

export const useUnmount = (fn: () => void) => {
    const fnRef = usePrevious(fn)

    useEffect(() => () => {
        fnRef?.()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}