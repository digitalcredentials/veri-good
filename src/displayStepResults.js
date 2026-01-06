import { sleep, showElement, hideElement, getElement, showText, displayError } from "./displayUtils.js";

const showStepResultFor = async (stepId, result) => {
    const stepElement = getElement(stepId)
    stepElement.style.display = 'flex'; 
    await sleep(1000);
    const circle = getElement('.circle-loader', stepElement)
    circle.classList.toggle('load-complete');
    if (result.valid) {
        showElement('.checkmark', 'block', stepElement) 
    } else {
        showElement('.cross', 'block', stepElement) 
        circle.style.borderColor = '#d00'
    } 
    showText('.message', result.message, stepElement)
}
const displayStepResults = async (result) => {
    hideElement("#verify-spinner")
    // stop everything if either the signature is bad or the 
    // issuer is unknown, and show an error
     if (! (result.signature.valid && result.issuer.valid) ) {
         const message = ! result.signature.valid ? 
            result.signature.message :
            result.issuer.message
        displayError(message)
        return
     }  
     
    // now show the credential recipient, credential name, and issuer   
    showElement("#details-container",'flex')
    showText('#holder-name', result.credential.credentialSubject.name)
    showText('#cred-name', result.credential.name)
    showText('#issuer-name', result.issuer.message)
  
   // now show the results, step by step
    showElement("#result-container")
    await showStepResultFor('#sigCheck', result.signature)
    await showStepResultFor('#expiryCheck', result.expiry)
    await showStepResultFor('#statusCheck', result.status)
    
}

export default displayStepResults