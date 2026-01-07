import { showElement, hideElement, showText } from "./displayUtils.js";

export const showVerifyingSpinner = async () => {
    hideElement("#input-container")
    hideElement("#verifyBtn")
    showElement("#verify-spinner", 'flex')
}

export const hideVerifyingSpinner = async () => {
    hideElement("#verify-spinner")
}

export const setSpinnerMessage = (message) => {
    showText('#spinner-message', message)
}

