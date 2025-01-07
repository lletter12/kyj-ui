export const restoreInitialOverflow = (element: HTMLElement) => {
    element.style.overflow = element.dataset.initialOverflow || ""
    element.removeAttribute("data-initial-overflow")
}