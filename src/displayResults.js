import { sleep, showElement, hideElement, getElement, showText, displayError } from "./displayUtils.js";
import { marked } from "marked";

marked.setOptions({
  breaks: true,
  gfm: true // The 'breaks' option requires GFM (GitHub Flavored Markdown) to be true
});

const showStepResultFor = async (stepId, result) => {
    const stepElement = getElement(stepId)
    stepElement.style.display = 'flex'; 
    await sleep();
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

    // also populate the fields in the 'more...' dialog
    // - if we have data
    
     if (result.credential.credentialSubject.achievement?.name) {
        showElement('#more-title-section')
        showText('#more-title', result.credential.credentialSubject.achievement?.name)
    }
    if (result.credential.credentialSubject.achievement?.description) {
        showElement('#more-description-section')
        showText('#more-description', result.credential.credentialSubject.achievement.description)
    }
    if (result.credential.issuanceDate || result.credential.validFrom) {
        showElement('#more-issued-date-section')
        showText('#more-issued-date', result.credential.issuanceDate || result.credential.validFrom)
    }
    if (result.credential.credentialSubject.achievement?.criteria?.narrative) {
        showElement('#more-criteria-section')
        const html = marked.parse(result.credential.credentialSubject.achievement.criteria.narrative);
        getElement('#more-criteria').innerHTML = html
    }
    
   // now show the results, step by step
    showElement("#result-container")
    await showStepResultFor('#sigCheck', result.signature)
    await showStepResultFor('#expiryCheck', result.expiry)
    await showStepResultFor('#statusCheck', result.status)
    
    // and now show the 'Verify Another' button,
    // after a short pause
    await sleep(500)
    showElement("#verifyAnotherBtn", 'flex')
}

export default displayStepResults