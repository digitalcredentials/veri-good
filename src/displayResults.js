function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const showElement = (selector, ancestor,displayType='block') => {
    ancestor.querySelector(selector).style.display = displayType
}

const hideElement = (selector, ancestor) => {
    ancestor.querySelector(selector).style.display = 'none'
}

const showText = (selector, ancestor, text) => {
    ancestor.querySelector(selector).textContent = text
}

const showStepResultFor = async (shadowRoot, stepId, result) => {
    const stepElement = shadowRoot.querySelector(stepId)
    stepElement.style.display = 'flex'; // make visible
    await sleep(500);
    const circle = stepElement.querySelector('.circle-loader')
    circle.classList.toggle('load-complete');
    if (result.valid) {
        showElement('.checkmark', stepElement) 
    } else {
        showElement('.cross', stepElement) 
        circle.style.borderColor = '#d00'
    } 
    stepElement.querySelector('.message').textContent = result.message
}
const displayResults = async (result, shadowRoot) => {
    hideElement("#input-container", shadowRoot)
    // stop everything if either the signature is bad or the 
    // issuer is unknown, and show an error
     if (! (result.signature.valid && result.issuer.valid) ) {
        showElement("#error-container", shadowRoot)
        shadowRoot.querySelector('#error-message').textContent = ! result.signature.valid ? 
            result.signature.message :
            result.issuer.message
        return
     }  
     
    // now show the credential recipient, credential name, and issuer   
    showElement("#details-container", shadowRoot, 'flex')
    showText('#holder-name', shadowRoot, result.credential.credentialSubject.name)
    showText('#cred-name', shadowRoot, result.credential.name)
    showText('#issuer-name', shadowRoot, result.issuer.message)
  
   // now show the results, step by step
    showElement("#result-container", shadowRoot)
    await showStepResultFor(shadowRoot, '#sigCheck', result.signature)
    await showStepResultFor(shadowRoot, '#expiryCheck', result.expiry)
    await showStepResultFor(shadowRoot, '#statusCheck', result.status)
    
}

export default displayResults