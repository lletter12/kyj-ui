export const restoreInitialPadding = (element: HTMLElement) => {
    element.style.paddingRight = element.dataset.initialPadding || ""
    element.removeAttribute("data-initial-padding")
}