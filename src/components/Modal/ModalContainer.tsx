/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useContext, useEffect, useRef, useState } from "react"

import { ModalBaseComponent } from "./Modal"
import { ModalContainerTheme as modalContainerTheme } from "./ModalContainerTheme"
import { ModalContext } from "./ModalContext"
import {useModalTransition} from "../../hooks/useModalTransition/useModalTransition.ts";
import {useIsomorphicLayoutEffect} from "../../hooks/useIsomorphicLayoutEffect/useIsomorphicLayoutEffect.ts";
import {cn} from "../../utils/cn/cn.ts";

export type ModalContainerThemeType = {
  centered?: string
  fullscreen?: string
  hidden?: string
  show?: string
  sizeDefault?: string
  wrapper?: string
  wrapperPositionDefault?: string
  bottom?: string
  animation?: string
  "top-left"?: string
  "top-right"?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
  "2xl"?: string
  "static-dialog"?: string
}

export interface ModalContainerProps extends ModalBaseComponent {
  centered?: "centered" | "un-centered"
  position?: "top-left" | "top-right" | "bottom"
  ref?: React.ForwardedRef<HTMLAllCollection>
  element?: React.ComponentProps<any>
  theme?: ModalContainerThemeType
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  className,
  centered,
  position,
  children,
  theme: customTheme,
  element: Element = "div",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { size } = useContext(ModalContext)
  const dialogRef = useRef<HTMLDivElement>(null)
  const { transitionDuration } = useModalTransition(dialogRef.current)
  const {
    isOpenModal,
    setTransitionDuration,
    animation,
    containerRefMarginBottom,
  } = useContext(ModalContext)

  if (position === "bottom") {
    customTheme = {
      show: "opacity-100",
      hidden: "translate-y-full opacity-0",
    }
  }

  if (position === "top-right" || position === "top-left") {
    customTheme = {
      show: "translate-x-0 opacity-100",
      hidden: "translate-x-full opacity-0",
    }
  }
  const theme = { ...modalContainerTheme, ...customTheme }

  useEffect(() => {
    setTransitionDuration(transitionDuration)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitionDuration])

  useIsomorphicLayoutEffect(() => {
    if (containerRefMarginBottom && dialogRef.current) {
      const marginBottom = window.getComputedStyle(
        dialogRef.current
      ).marginBottom
      containerRefMarginBottom(parseFloat(marginBottom))
    }
  }, [containerRefMarginBottom, dialogRef])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (isOpenModal) {
      timer = setTimeout(() => {
        setIsOpen(true)
      }, 50)
    } else {
      setIsOpen(false)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isOpenModal])

  const classes = cn(
    theme.wrapper,
    isOpen ? theme.show : theme.hidden,
    position ? theme[position] : theme.wrapperPositionDefault,
    size && theme[size] ? theme[size] : theme.sizeDefault,
    animation ? theme.animation : undefined,
    centered === "centered" && theme.centered,
    className
  )

  return (
    <Element className={classes} {...props} ref={dialogRef}>
      {children}
    </Element>
  )
}
