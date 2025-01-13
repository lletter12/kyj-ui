/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SyntheticEvent, useContext } from "react"

import { PopoverBaseComponent } from "./PopoverContainer"
import { PopoverContext } from "./PopoverContext"

export interface PopoverTogglerProps extends PopoverBaseComponent {
  element?: React.ComponentProps<any>
}

export const PopoverToggle: React.FC<PopoverTogglerProps> = ({
  children,
  element: Element = "button",
  ...props
}): JSX.Element => {
  const { handleMouseAndClick, referenceElement } = useContext(PopoverContext)

  return (
    <Element
      ref={referenceElement}
      onMouseEnter={(e: SyntheticEvent) => handleMouseAndClick(e, "mouseenter")}
      onMouseLeave={(e: SyntheticEvent) => handleMouseAndClick(e, "mouseleave")}
      {...props}
    >
      {children}
    </Element>
  )
}
