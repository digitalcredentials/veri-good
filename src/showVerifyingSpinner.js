import { sleep, showElement, hideElement } from "./displayUtils.js";

const showVerifyingSpinner = async (shadowRoot) => {
    hideElement("#input-container", shadowRoot)
    showElement("#verify-spinner", shadowRoot, 'flex')
    await sleep(1500);
}

export default showVerifyingSpinner