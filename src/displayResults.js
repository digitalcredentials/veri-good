export const displayResults = (result, resultContainer, inputContainer) => {
    inputContainer.hidden = true;
     if (result.verified) {
     // const resultList = document.createElement('ul');
     const resultList = resultContainer.querySelector('#resultList')
     resultList.hidden = false;
     const signatureResult = resultList.querySelector('#signatureResult')
     signatureResult.hidden = false;

    //  resultContainer.appendChild(resultList);
   //   const newItem = document.createElement("li");
   //   newItem.appendChild(document.createTextNode("Signature - verified!"));
   //   resultList.appendChild(newItem);
    } else {
        const errorElem = document.createElement('div');
        errorElem.textContent('The signature is not valid, and may have been tampered with.')
        resultContainer.appendChild(errorElem)
    }
}