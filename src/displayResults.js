import { sleep, showElement, hideElement, getElement, showText, displayError } from "./displayUtils.js";
import { marked } from "marked";

marked.setOptions({
  breaks: true,
  gfm: true // The 'breaks' option requires GFM (GitHub Flavored Markdown) to be true
});

// Shown on the title line when the credential carries no title of its own.
// The surrounding labels are slots an embedder may have reworded, so this
// stays a plain noun phrase that reads correctly after any of them.
const GENERIC_CREDENTIAL_TITLE = 'a credential'

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
        // name which of the two failed rather than restating the detail line
        // underneath it, and never imply the user mistyped something
        const title = ! result.signature.valid ?
            "Signature doesn't match" :
            "Issuer isn't recognised"
        displayError(message, title)
        return
     }  
     
    // now show the credential recipient, credential name, and issuer   
    showElement("#details-container",'flex')
    showText('#holder-name', result.credential.credentialSubject.name)

    // The title is the top-level name, falling back to the achievement name -
    // the same lookup that feeds the dialog title below, reused rather than
    // traversed twice. Note that this only finds a dict-shaped achievement:
    // an array-shaped one (which Open Badges permits) yields no title and
    // falls back to the generic title, exactly as it did before.
    //
    // When neither exists we still write a title, rather than leaving the
    // line blank or hiding the label: the card is one running sentence, so
    // an omission anywhere in the middle reads as a fragment. Writing it
    // unconditionally also means a title can never survive from a previous
    // verification -- which matters, because reset() intends to clear these
    // fields but queries '.toClear' while they carry 'to-clear', so it
    // clears nothing. That mismatch is a separate bug (#15) and is left
    // alone here.
    const achievement = result.credential.credentialSubject.achievement
    const achievementName = achievement?.name
    const credentialName = result.credential.name || achievementName
    showText('#cred-name', credentialName || GENERIC_CREDENTIAL_TITLE)

    showText('#issuer-name', result.issuer.message)

    // Every section of the dialog is conditional, so a credential with no
    // achievement and no issuance date opens a dialog containing nothing at
    // all. Don't offer a link that promises details we haven't got.
    const issuedDate = result.credential.issuanceDate || result.credential.validFrom
    // alignment may be a single object or an array, so normalise before asking
    // whether there is anything in it -- an empty array is truthy, and would
    // otherwise count as content and produce the empty dialog this guards against
    const alignments = [].concat(achievement?.alignment ?? [])
    const hasDialogContent = Boolean(
        achievementName ||
        achievement?.description ||
        issuedDate ||
        alignments.length ||
        achievement?.criteria?.narrative
    )
    // clear the inline display rather than setting one, so the link keeps
    // whatever the stylesheet gives it
    getElement('#more-link').style.display = hasDialogContent ? '' : 'none'

    // also populate the fields in the 'more...' dialog
    // - if we have data
    
     if (achievementName) {
        showElement('#more-title-section')
        showText('#more-title', achievementName)
    }
    if (achievement?.description) {
        showElement('#more-description-section')
        showText('#more-description', achievement.description)
    }
    if (issuedDate) {
        const issuanceDate = new Date(issuedDate)
        const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(issuanceDate);
        showElement('#more-issued-date-section');
        showText('#more-issued-date', formattedDate);
    }

   /*   "targetName": "Requirements Analysis",
        "targetUrl": "https://credentialfinder.org/credential/20229/Requirements_Analysis",
        "targetDescription": "This is a description" 
    */

    if (alignments.length) {
        showElement('#more-alignment-section')
        const listElement = getElement('#more-alignment-list')
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

    if (achievement?.criteria?.narrative) {
        showElement('#more-criteria-section')
        const html = marked.parse(achievement.criteria.narrative);
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