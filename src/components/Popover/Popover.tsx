/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"

import { PopoverContainer, PopoverContainerProps } from "./PopoverContainer"
import {
  placement,
  PopoverContent,
  PopoverContentProps,
} from "./PopoverContent"
import { PopoverToggle } from "./PopoverToggle"

export type PopoverType = "click" | "hover"

export interface PopoverProps
  extends PopoverContainerProps,
    Pick<
      PopoverContentProps,
      | "boundary"
      | "popperConfig"
      | "offset"
      | "fallbackPlacements"
      | "container"
      | "positionFixed"
      | "offSets"
    > {
  label: React.ReactNode
  className?: string
  PopoverToggleClassName?: string
  PopoverContentClassName?: string
  toggleElement?: React.ComponentProps<any>
  placement?: placement
}

export const Popover: React.FC<PopoverProps> = ({
  label,
  type,
  toggleElement,
  className,
  PopoverToggleClassName,
  PopoverContentClassName,
  children,
  placement,
  boundary,
  popperConfig,
  offset,
  fallbackPlacements,
  container,
  positionFixed,
  offSets,
  ...props
}) => {
  return (
    <PopoverContainer type={type} {...props} className={className}>
      <PopoverToggle element={toggleElement} className={PopoverToggleClassName}>
        {label}
      </PopoverToggle>
      <PopoverContent
        className={PopoverContentClassName}
        container={container}
        placement={placement}
        boundary={boundary}
        popperConfig={popperConfig}
        offset={offset}
        fallbackPlacements={fallbackPlacements}
        positionFixed={positionFixed}
        offSets={offSets}
      >
        {children}
      </PopoverContent>
    </PopoverContainer>
  )
}
