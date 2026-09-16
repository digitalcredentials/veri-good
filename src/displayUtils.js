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

// Failures the user cannot act on: the credential is bad, or its issuer is
// unknown. The paste was fine, so there is nothing to edit and nothing to
// blame the input for -- state what happened and offer the next verification.
export const displayError = (message, title = 'Verification failed') => {
    hideElement("#verify-spinner")
    clearInputError()
    showElement("#error-container")
    showText('#error-title', title)
    showText('#error-message', message)
    showElement("#verifyAnotherBtn", 'flex')
}

// Failures the user can act on: nothing parsed, or the url did not resolve.
// Keep them on the input with what they pasted still in the box -- losing a
// credential to a typo is the actual cost of an error here.
export const displayInputError = (message, pastedContent) => {
    hideElement("#verify-spinner")
    hideElement("#error-container")
    showElement("#input-container", 'block')
    showElement("#verifyBtn", 'flex')
    hideElement("#verifyAnotherBtn")

    const box = getElement('#vc-paste')
    if (typeof pastedContent === 'string') box.value = pastedContent
    box.classList.add('invalid')

    getElement('#input-error').classList.add('showing')
    getElement('#input-error-text').textContent = message
    box.focus()
}

export const clearInputError = () => {
    getElement('#vc-paste').classList.remove('invalid')
    getElement('#input-error').classList.remove('showing')
    getElement('#input-error-text').textContent = ''
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

    // clear any alignment list items
    getElement('#more-alignment-list').innerHTML = ''

    showText('#sig-message', VERIFYING_SIG_MSG)
    showText('#rev-message', VERIFYING_REV_MSG)
    showText('#exp-message', VERIFYING_EXP_MSG)
    getElement('#vc-paste').value = '';
    clearInputError()

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

