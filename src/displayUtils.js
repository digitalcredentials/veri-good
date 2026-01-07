import {VERIFYING_SIG_MSG, VERIFYING_EXP_MSG, VERIFYING_REV_MSG} from './constants.js'
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
 
     shadowRoot.querySelectorAll('.show-on-reset').forEach(element=>
        element.style.display = 'flex'
    );
     shadowRoot.querySelectorAll('.hide-on-reset').forEach(element=>
        element.style.display = 'none'
    );
    shadowRoot.querySelectorAll('.toClear').forEach(element=>
        element.textContent = ''
    );
    showText('#sig-message', VERIFYING_SIG_MSG)
    showText('#rev-message', VERIFYING_REV_MSG)
    showText('#exp-message', VERIFYING_EXP_MSG)
    getElement('#vc-paste').value = '';

}