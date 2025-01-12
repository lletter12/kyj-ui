/* eslint-disable react-hooks/exhaustive-deps */
import React, { HTMLAttributes, useEffect, useRef, useState } from "react"

import { SnackbarTheme as snackbarTheme } from "./SnackbarTheme"
import {clsx} from "clsx";
import {useModalTransition} from "../../hooks/useModalTransition/useModalTransition.ts";

export interface SnackbarThemeType {
  wrapper: string
  wrapperTransition: string
  wrapperVisible: string
  wrapperHidden: string
}

export interface SnackbarProps extends HTMLAttributes<HTMLElement> {
  show?: boolean
  setShow?: React.Dispatch<React.SetStateAction<boolean>>
  animation?: boolean
  autoHide?: boolean
  children?: React.ReactNode
  delay?: number
  onClose?: () => void
  onClosed?: () => void
  onShow?: () => void
  onShown?: () => void
  staticSnackbar?: boolean
  tag?: React.ElementType
  theme?: SnackbarThemeType
}

export const Snackbar: React.FC<SnackbarProps> = ({
  show = false,
  setShow,
  className,
  autoHide,
  animation = true,
  children,
  delay = 1000,
  staticSnackbar,
  tag: Tag = "div",
  theme: customTheme,
  onClose,
  onClosed,
  onShow,
  onShown,
  ...props
}) => {
  const [showSnackbar, setShowSnackbar] = useState<boolean | undefined>(false)
  const [isMounted, setIsMounted] = useState(false)

  const autoHideTimeout = useRef<NodeJS.Timeout | undefined>(undefined)

  const SnackbarRef = useRef<HTMLDivElement>(null)

  const theme = {
    ...snackbarTheme,
    ...customTheme,
  }

  const wrapperClasses = clsx(
    theme.wrapper,
    animation && theme.wrapperTransition,
    !staticSnackbar && theme.nonStatic,
    showSnackbar ? theme.wrapperVisible : theme.wrapperHidden,
    className
  )

  const { onTransitionShow, onTransitionHide } = useModalTransition(
    SnackbarRef.current
  )

  const addEvents = () => {
    if (showSnackbar && !staticSnackbar) {
      SnackbarRef.current?.addEventListener("mouseenter", () => {
        clearTimeout(autoHideTimeout.current)
      })

      SnackbarRef.current?.addEventListener("mouseleave", handleAutoHide)
    }
  }

  const removeEvents = () => {
    SnackbarRef.current?.removeEventListener("mouseenter", () => {
      clearTimeout(autoHideTimeout.current)
    })

    SnackbarRef.current?.removeEventListener("mouseleave", handleAutoHide)
  }

  const handleAutoHide = () => {
    if (autoHide) {
      autoHideTimeout.current = setTimeout(() => {
        setShowSnackbar(false)
      }, delay)
    }
  }

  useEffect(() => {
    if (show) {
      setIsMounted(true)
      return
    }
    setShowSnackbar(false)
  }, [show])

  useEffect(() => {
    if (!isMounted) {
      return
    }

    onTransitionShow(() => {
      setShowSnackbar(true)
      handleAutoHide()
    })

    return () => {
      removeEvents()
      clearTimeout(autoHideTimeout.current)
    }
  }, [isMounted])

  useEffect(() => {
    if (showSnackbar) {
      setIsMounted(true)
      onShow?.()
      addEvents()
      onShown?.()
    } else if (!showSnackbar && isMounted) {
      onClose?.()
      removeEvents()

      onTransitionHide(() => {
        setIsMounted(false)
        setShow?.(false)
        onClosed?.()
      })
    }
  }, [showSnackbar])

  return (
    <>
      {isMounted && (
        <Tag
          className={wrapperClasses}
          ref={SnackbarRef}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          {...props}
        >
          {children}
        </Tag>
      )}
    </>
  )
}
