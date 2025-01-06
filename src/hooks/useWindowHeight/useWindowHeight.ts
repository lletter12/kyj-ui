import React from "react";
import {useIsomorphicLayoutEffect} from "../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect.ts";

export const useWindowHeight = () => {
    const [windowHeight, setWindowHeight] = React.useState(0)

    useIsomorphicLayoutEffect(() => {
        const updateHeight = () => setWindowHeight(window.innerHeight)
        window.addEventListener("resize", updateHeight)
        updateHeight()
        return () => window.removeEventListener("resize", updateHeight)
    }, [])

    return windowHeight
}