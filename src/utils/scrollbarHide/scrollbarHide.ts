import {disableOverFlow} from "../disabledOverFlow/disabledOverFlow.ts";
import {saveInitialPadding} from "../saveInitialPadding/saveInitialPadding.ts";
import {getElementWidth} from "../getElementWidth/getElementWidth.ts";

export const scrollbarHide = (element?: HTMLElement, scrollbarCheck?: boolean) => {
    if (!element || !scrollbarCheck) return
    const width = getElementWidth()
    disableOverFlow(element)
    saveInitialPadding(element)
    element.style.paddingRight = `${width}px`
}