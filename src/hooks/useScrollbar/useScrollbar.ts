import {usePrevious} from "../usePrevious/usePrevious.ts";
import {useWindowElement} from "../useWindowElement/useWindowElement.ts";
import {useEffect} from "react";
import {scrollbarHide} from "../../utils/scrollbarHide/scrollbarHide.ts";
import {scrollbarReset} from "../../utils/scrollbarReset/scrollbarReset.ts";

export const useScrollbar = (isOpenModal: boolean, scrollbarCheck?: boolean) => {
    const prevOpen = usePrevious(isOpenModal)
    const element = useWindowElement()

    useEffect(() => {
        if(isOpenModal) {
            scrollbarHide(element, scrollbarCheck)
        }else {
            scrollbarReset(element, scrollbarCheck)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpenModal, prevOpen, element])
}