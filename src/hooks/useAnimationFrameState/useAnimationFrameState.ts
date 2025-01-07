import {Dispatch, SetStateAction, useCallback, useRef, useState} from "react";
import {useUnmount} from "./../useUnmount/useUnmount";

export type State<T> = [T, Dispatch<SetStateAction<T>>];
export type InitialState<T> = T | undefined | (() => T | undefined);

export const useAnimationFrameState = <T>(
    initialState?: InitialState<T>
): State<T | undefined> => {
    const ref = useRef<number | null>(null)
    const [state, setState] = useState<T | undefined>(initialState)

    const setRafState = useCallback(
        (value: T | undefined | ((prevState: T | undefined) => T | undefined)) => {
            cancelAnimationFrame(ref.current as number)
            ref.current = requestAnimationFrame(() => {
                setState(value)
            })
        }, [])

    useUnmount(() => {
        cancelAnimationFrame(ref.current as number)
    });

    return [state, setRafState]
};