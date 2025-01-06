/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext } from "react"

interface ModalContextProps {
  animation?: boolean
  isOpenModal?: boolean
  setTransitionDuration?: React.SetStateAction<any>
  gradiant?: boolean
  scrollActive?: boolean
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "static-dialog" | "fullscreen"
  handleScrollActive?: (value: boolean) => void
  handleCloseButton?: () => void
  setShow?: React.SetStateAction<any>
  headerRefHeight?: (value: number) => void
  footerRefHeight?: (value: number) => void
  containerRefMarginBottom?: (value: number) => void
  headerHeight?: number
  footerHeight?: number
  containerMarginBottom?: number
}

export const ModalContext = createContext<ModalContextProps>({
  animation: true,
  isOpenModal: false,
  setTransitionDuration: null,
  gradiant: false,
  size: undefined,
  scrollActive: false,
  handleScrollActive: undefined,
  footerHeight: undefined,
  containerMarginBottom: undefined,
})
