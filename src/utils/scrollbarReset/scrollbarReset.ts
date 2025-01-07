import {restoreInitialOverflow} from "../restoreInitialOverflow/restoreInitialOverflow.ts";
import {restoreInitialPadding} from "../restoreInitialPadding/restoreInitialPadding.ts";

export const scrollbarReset = (element?: HTMLElement, scrollbarCheck?: boolean) => {
    if (!scrollbarCheck || !element) return
    restoreInitialOverflow(element)
    restoreInitialPadding(element)
}