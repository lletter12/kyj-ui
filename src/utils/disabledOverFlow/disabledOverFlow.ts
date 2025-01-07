export const disableOverFlow = (element: HTMLElement) => {
    if (element.hasAttribute("data-initial-overflow")) return
    element.dataset.initialOverflow = element.style.overflow
    element.style.overflow = "hidden"
}