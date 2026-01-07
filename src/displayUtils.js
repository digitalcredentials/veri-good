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
    const element = getElement(selector, ancestor)
    element.style.display = 'block'
    element.textContent = text
}

export const getElement = (selector, ancestor=shadowRoot) => {
    return ancestor.querySelector(selector)
}

export const displayError = (message) => {
    hideElement("#verify-spinner")
    showElement("#error-container")
    showText('#error-message', message)
    showElement("#verifyAnotherBtn", 'flex')
}

export const reset = () => {
    ['#error-container', '#error-message', "#verifyAnotherBtn", "#result-container", '#details-container'].forEach(element=>
        hideElement(element)
    );
    getElement('#vc-paste').value = '';
    ['#input-container', "#verifyBtn"].forEach(element=>
        showElement(element, 'flex')
    )
}