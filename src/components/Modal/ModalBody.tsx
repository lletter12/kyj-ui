/* eslint-disable @typescript-eslint/no-explicit-any */

import { ModalBodyTheme as modalBodyTheme } from "./ModalBodyTheme"
import { ModalContext } from "./ModalContext"
import React, {CSSProperties, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {useWindowHeight} from "../../hooks/useWindowHeight/useWindowHeight.ts";
import {cn} from "../../utils/cn/cn.ts";

export type ModalBodyThemeType = {
    wrapper?: string
    scrollable?: string
    fullSizeWrapper?: string
}

export interface ModalBodyProps {
    className?: string
    children: ReactNode
    ref?: React.ForwardedRef<HTMLElement>
    element?: React.ComponentProps<any>
    theme?: ModalBodyThemeType
}

export const ModalBody: React.FC<ModalBodyProps> = React.forwardRef<
    HTMLElement,
    ModalBodyProps
>(
    (
        {
            className,
            children,
            theme: customTheme,
            element: Element = "div",
            ...props
        },
        ref
    ) => {
        const {
            size,
            handleScrollActive,
            headerHeight,
            footerHeight,
            containerMarginBottom,
        } = useContext(ModalContext)

        const modalInnerRef = useRef<HTMLElement>(null)
        const modalReference = ref ? ref : modalInnerRef
        const windowY = useWindowHeight()
        const [styles, setStyles] = useState<CSSProperties | undefined>()
        const theme = { ...modalBodyTheme, ...customTheme }
        const classes = cn(
            size === "fullscreen" ? theme.fullSizeWrapper : theme.wrapper,
            modalBodyTheme.scrollable,
            className
        )

        useEffect(() => {
            if (
                modalInnerRef.current &&
                modalInnerRef.current.scrollHeight &&
                modalInnerRef.current.scrollHeight >
                modalInnerRef.current.getBoundingClientRect().height
            ) {
                handleScrollActive?.(
                    modalInnerRef.current.scrollHeight -
                    modalInnerRef.current.clientHeight ===
                    0
                )
            }

            if (windowY && headerHeight && footerHeight) {
                setStyles({
                    maxHeight: `${windowY - (headerHeight + footerHeight + (containerMarginBottom || 0) + 56)}px`,
                })
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
            modalInnerRef.current,
            scroll,
            windowY,
            headerHeight,
            footerHeight,
            containerMarginBottom,
        ])

        return (
            <Element
                className={classes}
                style={styles}
                {...props}
                ref={modalReference}
            >
                {children}
            </Element>
        )
    }
)
