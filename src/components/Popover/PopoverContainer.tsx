/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  RefObject,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { PopoverType } from "./Popover"
import { PopoverContext } from "./PopoverContext"

export type PopoverBaseComponent = Pick<
  React.HTMLAttributes<HTMLElement>,
  | "className"
  | "id"
  | "style"
  | "onClick"
  | "onMouseUp"
  | "onMouseMove"
  | "onMouseDown"
  | "onMouseEnter"
  | "onMouseLeave"
  | "onMouseOver"
  | "onMouseOut"
  | "onKeyDown"
  | "onKeyUp"
  | "onTouchStart"
  | "onTouchMove"
  | "onTouchEnd"
  | "onScroll"
  | "onDrop"
  | "children"
> & {
  [rest: string]: any
}

export interface PopoverContainerProps extends PopoverBaseComponent {
  isOpen?: boolean
  element?: React.ComponentProps<any>
  enabled?: boolean
  trigger?: string
  onShow?: (e: SyntheticEvent) => any
  onShown?: () => any
  onHide?: (e: SyntheticEvent) => any
  onHidden?: () => any
  onMouseEnter?: (e: SyntheticEvent) => any
  onMouseLeave?: (e: SyntheticEvent) => any
  type?: PopoverType
  referenceElement?: RefObject<HTMLDivElement>
}

export const PopoverContainer: React.FC<PopoverContainerProps> = ({
  children,
  element: Element = "div",
  isOpen = false,
  enabled = true,
  type,
  trigger = type === "hover" ? "hover focus" : "click",
  onShow,
  onHide,
  onShown,
  onHidden,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const [isOpenState, setIsOpenState] = useState<boolean>(isOpen ?? false)
  const [isFocused, setIsFocused] = useState(false)

  const referenceElement = useRef<HTMLDivElement>(null)

  const handleMouseAndClick = useCallback(
    (
      e: SyntheticEvent | React.MouseEvent,
      eventType: "mouseenter" | "mouseleave" | "mousedown"
    ) => {
      if (!enabled) return

      eventType === "mouseenter" && onMouseEnter?.(e)
      eventType === "mouseleave" && onMouseLeave?.(e)

      if (
        (eventType === "mouseleave" && !trigger.includes("click")) ||
        ((eventType === "mouseenter" || eventType === "mouseleave") &&
          trigger !== "click" &&
          trigger !== "focus")
      ) {
        if (
          (eventType === "mouseenter" && isFocused) ||
          (eventType === "mouseleave" && !isOpenState) ||
          (trigger.includes("click") &&
            trigger.includes("focus") &&
            !trigger.includes("hover"))
        ) {
          return
        }
        if (eventType === "mouseenter") {
          !isFocused && onShow?.(e)
          !e.defaultPrevented && setIsOpenState(true)
        } else {
          !isFocused && onHide?.(e)
          !e.defaultPrevented && setIsOpenState(false)
        }
      } else if (eventType === "mousedown") {
        if (e.target === referenceElement.current) {
          if (trigger === "click") {
            !isOpenState && onShow?.(e)
            isOpenState && onHide?.(e)
            setIsOpenState((prevState) => !prevState)
          } else if (trigger.includes("focus")) {
            !isFocused && !isOpenState && onShow?.(e)
            setIsFocused(true)
          } else if (trigger.includes("click")) {
            !isFocused && !isOpenState && onShow?.(e)
            isFocused && onHide?.(e)
            setIsFocused((prev) => !prev)
            isFocused && setIsOpenState(false)
          }
        } else {
          if (trigger.includes("focus")) {
            isFocused && onHide?.(e)
            setIsFocused(false)
          }
        }
      }
    },
    [enabled, trigger, isOpenState, isFocused]
  )

  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleEvent = (event: any) => {
      handleMouseAndClick(event, "mousedown")
    }

    document.addEventListener("mousedown", handleEvent)
    return () => {
      document.removeEventListener("mousedown", handleEvent)
    }
  }, [enabled, handleMouseAndClick])

  useEffect(() => {
    if (!isOpen) {
      setIsOpenState(false)
    }
  }, [isOpen])

  return (
    <PopoverContext.Provider
      value={{
        referenceElement,
        isOpenState,
        isFocused,
        enabled,
        trigger,
        onShown,
        onHidden,
        handleMouseAndClick,
      }}
    >
      <Element {...props}>{children}</Element>
    </PopoverContext.Provider>
  )
}
