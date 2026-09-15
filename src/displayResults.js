import { sleep, showElement, hideElement, getElement, showText, displayError } from "./displayUtils.js";
import { marked } from "marked";

marked.setOptions({
  breaks: true,
  gfm: true // The 'breaks' option requires GFM (GitHub Flavored Markdown) to be true
});

const dateOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};

const showStepResultFor = async (stepId, result) => {
    await sleep(500); // and a short pause before starting the next spinner
    const stepElement = getElement(stepId)
    stepElement.style.display = 'flex'; 
    await sleep();
    const circle = getElement('.circle-loader', stepElement);
    circle.classList.add('load-complete');
   // circle.classList.toggle('load-complete');
    if (result.valid) {
        showElement('.checkmark', 'block', stepElement)
        circle.style.borderColor = '#5cb85c'
    } else {
        showElement('.cross', 'block', stepElement) 
        circle.style.borderColor = '#d00'
    } 
    await sleep(200); // and a short pause before showing the success message
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

    // The title is the top-level name, falling back to the achievement name -
    // the same lookup that feeds the dialog title below, reused rather than
    // traversed twice. Note that this only finds a dict-shaped achievement:
    // an array-shaped one (which Open Badges permits) yields no title and
    // falls through to suppression, exactly as it did before.
    const achievementName = result.credential.credentialSubject.achievement?.name
    const credentialName = result.credential.name || achievementName
    const wasAwardedLabel = getElement('slot[name="wasAwarded"]')
    const credNameElement = getElement('#cred-name')
    if (credentialName) {
        showText('#cred-name', credentialName)
        // clear the inline display rather than setting one, so the slot keeps
        // whatever the stylesheet gives it
        wasAwardedLabel.style.display = ''
    } else {
        // With no title anywhere, hide the 'was awarded a' label too, so the
        // card reads as two lines rather than three with a hole in the middle.
        // This hides an embedder's replacement for the slot as well, which is
        // accepted: a label framing an empty space is worse.
        // Clear the element explicitly -- reset() looks for '.toClear' while
        // these elements carry 'to-clear', so it clears nothing, and a title
        // from a previous verification would otherwise survive into this one.
        credNameElement.textContent = ''
        credNameElement.style.display = 'none'
        wasAwardedLabel.style.display = 'none'
    }

    showText('#issuer-name', result.issuer.message)

    // also populate the fields in the 'more...' dialog
    // - if we have data
    
     if (achievementName) {
        showElement('#more-title-section')
        showText('#more-title', achievementName)
    }
    if (result.credential.credentialSubject.achievement?.description) {
        showElement('#more-description-section')
        showText('#more-description', result.credential.credentialSubject.achievement.description)
    }
    if (result.credential.issuanceDate || result.credential.validFrom) {
        const issuanceDate = (result.credential.issuanceDate || result.credential.validFrom) ?
            new Date(result.credential.issuanceDate || result.credential.validFrom) : 
            null
        const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(issuanceDate);
        showElement('#more-issued-date-section');
        showText('#more-issued-date', formattedDate);
    }

   /*   "targetName": "Requirements Analysis",
        "targetUrl": "https://credentialfinder.org/credential/20229/Requirements_Analysis",
        "targetDescription": "This is a description" 
    */

    if (result.credential.credentialSubject.achievement?.alignment) {
        showElement('#more-alignment-section')
        const listElement = getElement('#more-alignment-list')
        // make an array if not already
        const alignments = [].concat(result.credential.credentialSubject.achievement.alignment);
        alignments.forEach(alignment=>{ 
            const newLink = document.createElement('a');
            newLink.href = alignment.targetUrl;
            newLink.title = 'Go to alignment page.';
            newLink.target = '_blank'; 
            newLink.textContent = alignment.targetName;
            newLink.classList.add('alignment-link');

            const newListItem = document.createElement('li');
            newListItem.appendChild(newLink);
            listElement.appendChild(newListItem);
        })
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