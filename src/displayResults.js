function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const showStepResultFor = async (shadowRoot, stepId, result) => {
    const stepElement = shadowRoot.querySelector(stepId)
    stepElement.style.display = 'flex'; // make visible
    await sleep(1800);

    // TODO put in a red X if result.valid is false.

    stepElement.querySelector('.circle-loader').classList.toggle('load-complete');
    stepElement.querySelector('.checkmark').style.display = 'block';
    stepElement.querySelector('.message').textContent = result.message
}
const displayResults = async (result, shadowRoot) => {
    
    const inputContainer = shadowRoot.querySelector("#inputCont");
    inputContainer.hidden = true;
    
     if (! result.signature.valid) {
        const errorContainer = shadowRoot.querySelector("#errorCont");
        errorContainer.hidden = false;
        const errorElem = document.createElement('div');
        errorElem.textContent = 'The signature is not valid, and may have been tampered with.'
        errorContainer.appendChild(errorElem)
        return
     }

    const resultContainer = shadowRoot.querySelector("#resultCont");
    resultContainer.hidden = false;
    await showStepResultFor(shadowRoot, '#sigCheck', result.signature)
    await showStepResultFor(shadowRoot, '#expiryCheck', result.expiry)
    
}

export default displayResults