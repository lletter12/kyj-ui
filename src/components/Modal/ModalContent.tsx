/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react"

import { ModalContentTheme as modalContentTheme } from "./ModalContentTheme"
import {ModalBaseComponent} from "./Modal.tsx";
import {cn} from "../../utils/cn/cn.ts";

export type ModalContentThemeType = {
  scrollable?: string
  wrapper?: string
}

export interface ModalContentProps extends ModalBaseComponent {
  ref?: React.ForwardedRef<HTMLAllCollection>
  element?: React.ComponentProps<any>
  theme?: ModalContentThemeType
  position?: "bottom"
}

export const ModalContent: React.FC<ModalContentProps> = React.forwardRef<
  HTMLAllCollection,
  ModalContentProps
>(
  (
    {
      className,
      children,
      theme: customTheme,
      element: Element = "div",
      style,
      ...props
    },
    ref
  ) => {
    const theme = { ...modalContentTheme, ...customTheme }
    const contentRef = useRef<HTMLDivElement>(null)
    const contentReference = ref ? ref : contentRef

    const classes = cn(className, theme.wrapper)

    return (
      <Element
        className={classes}
        style={style}
        {...props}
        ref={contentReference}
      >
        {children}
      </Element>
    )
  }
)
