function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const displayResults = async (result, shadowRoot) => {
    const resultContainer = shadowRoot.querySelector("#resultCont");
    const inputContainer = shadowRoot.querySelector("#inputCont");
    inputContainer.hidden = true;
   resultContainer.hidden = false;
     if (result.verified) {
        shadowRoot.querySelector('#sigCheck').style.display = 'flex';
        await sleep(1800);
        shadowRoot.querySelector('.circle-loader').classList.toggle('load-complete');
        shadowRoot.querySelector('.checkmark').style.display = 'block';
        shadowRoot.querySelector('#sigMessage').textContent = 'Signature verified.'
    } else {
        const errorElem = document.createElement('div');
        errorElem.textContent('The signature is not valid, and may have been tampered with.')
        resultContainer.appendChild(errorElem)
    }
}

export default displayResults