
import processCredential from './processCredential.js'
import {reset} from './displayUtils.js'

const listeners = []

const initializeDragNDrop = (shadowRoot) => {
  const dropArea = shadowRoot.getElementById("drop-zone");
  const fileInput = dropArea.querySelector(".drop-zone__input");

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    shadowRoot.addEventListener(eventName, preventDefaults, false); 
    listeners.push({element: dropArea, handler: preventDefaults, eventName})
    listeners.push({element: shadowRoot, handler: preventDefaults, eventName})
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function addDropZoneOverClass() {
    dropArea.classList.add("drop-zone--over")
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(
      eventName,
      addDropZoneOverClass,
      false
    );
    listeners.push({element: dropArea, handler: addDropZoneOverClass, eventName})
  });

  function removeDropZoneOverClass() {
    dropArea.classList.remove("drop-zone--over")
  }

  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(
      eventName,
      removeDropZoneOverClass,
      false
    );
    listeners.push({element: dropArea, handler: removeDropZoneOverClass, eventName})
  });

  function handleDrop() {
    const dt = e.dataTransfer;
    const files = dt.files; 
    handleFiles(files);
  }
  dropArea.addEventListener("drop", handleDrop, false);
  listeners.push({element: dropArea, handler: handleDrop, eventName: "drop"})


  function handleDropAreaClick() {
    fileInput.click();
  };
  dropArea.addEventListener("click", handleDropAreaClick)
  listeners.push({element: dropArea, handler: handleDropAreaClick, eventName: "click"})

  function handleFileInputChange(e) {
    handleFiles(e.target.files);
  }
  fileInput.addEventListener("change", handleFileInputChange);
  listeners.push({element: fileInput, handler: handleFileInputChange, eventName: "change"})

  function handleFiles(files) {
    // TODO show error message if more than one file
    files = [...files];
    files.forEach(verifyFile); 
  }

  function verifyFile(file) {
    if (file.type.includes("json")) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = function () {
       shadowRoot.querySelector("#vc-paste").value = reader.result; 
       shadowRoot.querySelector('#verifyBtn').click()
      };
    } else {
      // TODO: show error about this having to be json.
    }
  }
};

const initializeVerifyBtn = (shadowRoot, registryList) => {
    const eventName = 'click'
    const element = shadowRoot.querySelector("#verifyBtn")
    const handler = () => {
        const pastedContent = shadowRoot.querySelector("#vc-paste").value
        processCredential(pastedContent, registryList);
    }
    element.addEventListener(eventName, handler);
    listeners.push({element, handler, eventName});
}

const initializeVerifyAnotherBtn = (shadowRoot) => {
    const eventName = 'click'
    const element = shadowRoot.querySelector("#verifyAnotherBtn")
    const handler = () => { reset() }
    element.addEventListener(eventName, handler);
    listeners.push({element, handler, eventName});
}

export const initializeListeners = (shadowRoot, registryList) => {
    initializeVerifyAnotherBtn(shadowRoot)
    initializeVerifyBtn(shadowRoot, registryList)
    initializeDragNDrop(shadowRoot)
}

export const removeListeners = () => {
  listeners.forEach(listener=>
    listener.element.removeEventListener(listener.type, listener.handler)
  )
  listeners = null;
}