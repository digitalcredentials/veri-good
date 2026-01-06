let shadowRoot;

export const setShadowRoot = (element) => {
    shadowRoot = element;
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const showElement = (selector, displayType='block', ancestor=shadowRoot ) => {
    getElement(selector, ancestor).style.display = displayType
}

export const hideElement = (selector, ancestor=shadowRoot) => {
    getElement(selector, ancestor).style.display = 'none'
}

export const showText = (selector, text, ancestor=shadowRoot) => {
    getElement(selector, ancestor).textContent = text
}

export const getElement = (selector, ancestor=shadowRoot) => {
    return ancestor.querySelector(selector)
}

export const displayError = (message) => {
    hideElement("#verify-spinner")
    showElement("#error-container")
    showText('#error-message', message)
}