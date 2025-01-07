/* eslint-disable @typescript-eslint/no-explicit-any */

import {ModalTheme as modalTheme} from "./ModalTheme.ts"
import {ModalContext} from "./ModalContext"
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useWindowElement} from "../../hooks/useWindowElement/useWindowElement.ts";
import {useFocusTrap} from "../../hooks/useFocusTrap/useFocusTrap.ts";
import {cn} from "../../utils/cn/cn.ts";
import {useTransition} from "../../hooks/useTransition/useTransition.ts";
import {useIsomorphicLayoutEffect} from "../../hooks/useIsomorphicLayoutEffect/useIsomorphicLayoutEffect.ts";
import {Backdrop} from "../Backdrop/BackDrop.tsx";
import ReactDOM from "react-dom";
import {useScrollbar} from "../../hooks/useScrollbar/useScrollbar.ts";

export type ModalBaseComponent = Pick<
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

export type ModalComponentThemeType = {
    show?: string
    static?: string
    staticProperties?: string
    wrapper?: string
}

export interface ModalComponentProps extends ModalBaseComponent {
    rootId?: string
    appendToBody?: boolean
    backdrop?: boolean
    closeOnEsc?: boolean
    leaveHiddenModal?: boolean
    modalRef?: React.RefObject<any>
    show: boolean
    setShow?: React.SetStateAction<any>
    staticBackdrop?: boolean
    staticModalAnimation?: boolean
    animate?: boolean
    duplicateBackdrop?: boolean
    isSSR?: boolean
    element?: React.ComponentProps<any>
    theme?: ModalComponentThemeType
    gradiant?: boolean
    animation?: boolean
    scrollbarCheck?: boolean
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "static-dialog" | "fullscreen"
    defaultClose?: () => void
    maintainPrevCount?: number
}

export const Modal: React.FC<ModalComponentProps> = ({
                                                         show = false,
                                                         setShow,
                                                         appendToBody = false,
                                                         backdrop = true,
                                                         staticBackdrop,
                                                         animate = true,
                                                         duplicateBackdrop = false,
                                                         staticModalAnimation = true,
                                                         scrollbarCheck = true,
                                                         closeOnEsc = true,
                                                         leaveHiddenModal = true,
                                                         gradiant = false,
                                                         modalRef,
                                                         children,
                                                         className,
                                                         backdropClassName,
                                                         animation = true,
                                                         size,
                                                         element: Element = "div",
                                                         theme: customTheme,
                                                         defaultClose,
                                                         maintainPrevCount,
                                                         ...props
                                                     }) => {

    const theme = {...modalTheme, ...customTheme}
    const element = useWindowElement()

    const {initFocusTrap, removeFocusTrap} = useFocusTrap()
    const [isOpenModal, setIsOpenModal] = useState(show || false)
    const [transitionDuration, setTransitionDuration] = useState<number>(0)
    const [staticModal, setStaticModal] = useState(false)
    const [scrollActive, setScrollActive] = useState(false)
    const [footerHeight, setFooterHeight] = useState<number>(0)
    const [headerHeight, setHeaderHeight] = useState<number>(0)
    const [containerMarginBottom, setContainerMarginBottom] = useState<number>(0)

    const modalInnerRef = useRef<HTMLElement>(null)
    const modalReference = modalRef ? modalRef : modalInnerRef

    const modalClasses = cn(
        theme.wrapper,
        className,
        staticBackdrop && theme.staticProperties,
        staticModal && staticModalAnimation ? theme.static : "animate-none",
        isOpenModal ? theme.show : "hidden"
    )

    const {onTransitionHide} = useTransition(modalReference.current)

    const updateScrollActive = (value: boolean) => {
        setScrollActive(value)
    }

    const updateHeaderHeight = (value: number) => {
        setHeaderHeight(value)
    }
    const updateFooterHeight = (value: number) => {
        setFooterHeight(value)
    }
    const updateContainerRefMarginBottom = (value: number) => {
        setContainerMarginBottom(value)
    }

    const startStaticAnimation = () => {
        setStaticModal(true)

        onTransitionHide(() => {
            setStaticModal(false)
        })
    }

    const handleBackdropClick = (event: Event) => {
        if (event.target !== modalReference.current || !backdrop) {
            return
        }

        if (staticBackdrop) {
            startStaticAnimation()
            return
        }

        if (defaultClose) {
            defaultClose()
        } else {
            setShow(false)
        }
    }

    const handleKeydown = useCallback(
        (event: KeyboardEvent) => {
            if (closeOnEsc) {
                if (isOpenModal && event.key === "Escape") {
                    if (!staticBackdrop) {
                        setShow(false)
                    } else {
                        startStaticAnimation()
                    }
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isOpenModal]
    )

    const openModal = () => {
        setIsOpenModal(true)
        initFocusTrap(modalReference.current as HTMLElement)
    }

    const closeModal = () => {
        setIsOpenModal(false)
        removeFocusTrap()
    }

    useEffect(() => {
        if (show) {
            openModal()
        } else {
            setTimeout(() => {
                closeModal()
            }, transitionDuration)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

    useEffect(() => {
        if (maintainPrevCount && maintainPrevCount > 0) {
            modalReference.current.style.zIndex = `${1000 + maintainPrevCount * 100 + maintainPrevCount * 10}`
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maintainPrevCount]);

    useScrollbar(isOpenModal, scrollbarCheck)

    useIsomorphicLayoutEffect(() => {
        window.addEventListener("keydown", handleKeydown)

        return () => {
            window.removeEventListener("keydown", handleKeydown)
        }
    }, [handleKeydown])

    const modalTemplate = (
        <ModalContext.Provider
            value={{
                isOpenModal: show,
                setTransitionDuration,
                scrollActive: scrollActive,
                handleScrollActive: updateScrollActive,
                gradiant: gradiant,
                size: size,
                handleCloseButton: defaultClose,
                animation: animation,
                headerRefHeight: updateHeaderHeight,
                headerHeight: headerHeight,
                footerRefHeight: updateFooterHeight,
                footerHeight: footerHeight,
                containerRefMarginBottom: updateContainerRefMarginBottom,
                containerMarginBottom: containerMarginBottom,
            }}
        >
            {(leaveHiddenModal || show) && (
                <Element
                    ref={modalReference}
                    className={modalClasses}
                    onClick={handleBackdropClick}
                    {...(isOpenModal && {"aria-modal": "true"})}
                    {...(!isOpenModal && {"aria-hidden": "true"})}
                    {...props}
                >
                    {children}
                </Element>
            )}
            {backdrop && (leaveHiddenModal || show) && (
                <Backdrop
                    show={isOpenModal}
                    className={backdropClassName}
                    appendToBody={appendToBody}
                    animate={animate}
                    duplicateBackdrop={duplicateBackdrop}
                    maintainPrevCount={maintainPrevCount}
                />
            )}
        </ModalContext.Provider>
    )

    const appendToBodyTemplate = (
        <>{element && ReactDOM.createPortal(modalTemplate, element)}</>
    )

    return <>{appendToBody ? appendToBodyTemplate : modalTemplate}</>
}
