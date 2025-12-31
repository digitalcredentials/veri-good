function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const showStepResultFor = async (shadowRoot, stepId, result) => {
    const stepElement = shadowRoot.querySelector(stepId)
    stepElement.style.display = 'flex'; // make visible
    await sleep(2000);
    const circle = stepElement.querySelector('.circle-loader')
    circle.classList.toggle('load-complete');
    if (result.valid) {
        stepElement.querySelector('.checkmark').style.display = 'block' 
   //     stepElement.querySelector('.draw-x-slowly').style.display = 'none' 
    } else {
   //     stepElement.querySelector('.checkmark').style.display = 'none' 
        stepElement.querySelector('.draw-x-slowly').style.display = 'block' 
        circle.style.borderColor = '#d00'
    } 
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

    shadowRoot.querySelector("#resultCont").hidden = false;
    await showStepResultFor(shadowRoot, '#sigCheck', result.signature)
    await showStepResultFor(shadowRoot, '#expiryCheck', result.expiry)
    await showStepResultFor(shadowRoot, '#statusCheck', result.status)
    
}

export default displayResults