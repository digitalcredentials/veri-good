function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const showStepResultFor = async (shadowRoot, stepId, result) => {
    const stepElement = shadowRoot.querySelector(stepId)
    stepElement.style.display = 'flex'; // make visible
    await sleep(500);
    const circle = stepElement.querySelector('.circle-loader')
    circle.classList.toggle('load-complete');
    if (result.valid) {
        stepElement.querySelector('.checkmark').style.display = 'block' 
    } else {
        stepElement.querySelector('.cross').style.display = 'block' 
        circle.style.borderColor = '#d00'
    } 
    stepElement.querySelector('.message').textContent = result.message
}
const displayResults = async (result, shadowRoot) => {
    
    const inputContainer = shadowRoot.querySelector("#inputCont");
    inputContainer.hidden = true;
    
    // we stop everything if either the signature is bad or the 
    // issuer is unknown
     if (! (result.signature.valid && result.issuer.valid) ) {
        const errorContainer = shadowRoot.querySelector("#errorCont");
        errorContainer.hidden = false;
        const errorElem = document.createElement('div');
        
        errorElem.textContent = ! result.signature.valid ? 
            result.signature.message :
            result.issuer.message
    
        errorContainer.appendChild(errorElem)
        return
     }  
     
    // now show the credential name, recipient and issuer
    shadowRoot.querySelector("#detailsCont").style.display = 'flex' 
     shadowRoot.querySelector('#cred-name').textContent = result.credential.name
     shadowRoot.querySelector('#issuer-name').textContent = result.issuer.message
     shadowRoot.querySelector('#holder-name').textContent = result.credential.credentialSubject.name

    shadowRoot.querySelector("#resultCont").hidden = false;
    await showStepResultFor(shadowRoot, '#sigCheck', result.signature)
    await showStepResultFor(shadowRoot, '#expiryCheck', result.expiry)
    await showStepResultFor(shadowRoot, '#statusCheck', result.status)
  //  await showStepResultFor(shadowRoot, '#issuerCheck', result.issuer)
    
}

export default displayResults