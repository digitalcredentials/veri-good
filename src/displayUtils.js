import {VERIFYING_SIG_MSG, VERIFYING_EXP_MSG, VERIFYING_REV_MSG} from './constants.js'

const DEFAULT_SLEEP_TIME = 1000
let shouldDisablePauses = false;

let shadowRoot;
let hostElement;

export const setHostElement = (element) => {
    hostElement = element;
    // also set the shadowRoot for convenience
    shadowRoot = element.shadowRoot
}

export const setDisablePauses = (newValue) => {
    shouldDisablePauses = newValue;
}

export const sleep = (ms=DEFAULT_SLEEP_TIME) => {
    // pauses can be disabled for faster automated testing
    if (shouldDisablePauses) return Promise.resolve();
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

export const showDialog = (id) => {
    const dialog = getElement(id);
    dialog.style.left = `${hostElement.offsetLeft + 40}px`;
    dialog.style.top = `${hostElement.offsetTop + 40}px`;
    dialog.showModal()
    //scroll to top of the dialog
    dialog.scrollTo(0, 0);

}

export const closeDialog = (id) => {
    getElement(id).close()
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

    // criteria shows html rendered from markdown,
    // rather than plain text, so have to clear separately
    getElement('#more-criteria').innerHTML = ''

    showText('#sig-message', VERIFYING_SIG_MSG)
    showText('#rev-message', VERIFYING_REV_MSG)
    showText('#exp-message', VERIFYING_EXP_MSG)
    getElement('#vc-paste').value = '';

    shadowRoot.querySelectorAll('.circle-loader').forEach(element=>
     {
        element.classList.remove('load-complete', 'circle-loader');
        element.classList.add('circle-loader');
        hideElement('.checkmark', element);
        hideElement('.cross', element);
       element.style.border = '3px solid rgba(0, 0, 0, 0.2)'
       element.style.borderLeftColor = '#5cb85c'
     }
    );
        
    

}

