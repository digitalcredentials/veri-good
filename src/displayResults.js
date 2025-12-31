function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const displayResults = async (result, shadowRoot) => {
    const resultContainer = shadowRoot.querySelector("#resultCont");
    const inputContainer = shadowRoot.querySelector("#inputCont");
    inputContainer.hidden = true;
    
     if (! result.signatureValid) {
        const errorContainer = shadowRoot.querySelector("#errorCont");
        errorContainer.hidden = false;
        const errorElem = document.createElement('div');
        errorElem.textContent = 'The signature is not valid, and may have been tampered with.'
        errorContainer.appendChild(errorElem)
     } else {
        resultContainer.hidden = false;
        shadowRoot.querySelector('#sigCheck').style.display = 'flex';
        await sleep(1800);
        shadowRoot.querySelector('.circle-loader').classList.toggle('load-complete');
        shadowRoot.querySelector('.checkmark').style.display = 'block';
        shadowRoot.querySelector('#sigMessage').textContent = 'Signature verified.'
    } 
}

export default displayResults