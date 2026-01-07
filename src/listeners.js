
import processCredential from './processCredential.js'
import {reset, showDialog, getElement} from './displayUtils.js'

const listeners = []

const initializeDragNDrop = (shadowRoot) => {
  const dropArea = getElement("#drop-zone");
  const fileInput = getElement(".drop-zone__input", dropArea);

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
       getElement("#vc-paste").value = reader.result; 
       getElement('#verifyBtn').click()
      };
    } else {
      // TODO: show error about this having to be json.
    }
  }
};

const initializeVerifyBtn = (registryList) => {
    const eventName = 'click'
    const element = getElement("#verifyBtn")
    const handler = () => {
        const pastedContent = getElement("#vc-paste").value
        processCredential(pastedContent, registryList);
    }
    element.addEventListener(eventName, handler);
    listeners.push({element, handler, eventName});
}

const initializeVerifyAnotherBtn = () => {
    const eventName = 'click'
    const element = getElement("#verifyAnotherBtn")
    const handler = () => { 
        reset() 
    }
    element.addEventListener(eventName, handler);
    listeners.push({element, handler, eventName});
}

const initializeMoreLink = () => {
    const eventName = 'click'
    const element = getElement("#more-link")
    const handler = () => {
      showDialog('#more-dialog', '#details-container')
     }
    element.addEventListener(eventName, handler);
    listeners.push({element, handler, eventName});
}

const initializeMoreDialogClose = () => {
  const eventName = 'click'
  const element = getElement("#more-dialog")
  const handler = () => element.close()
  /* const handler = e => {
    const dialogDimensions = element.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      element.close()
    }
  } */
  element.addEventListener(eventName, handler);
  listeners.push({element, handler, eventName});
}

export const initializeListeners = (shadowRoot, registryList) => {
    initializeMoreLink()
    initializeMoreDialogClose()
    initializeVerifyAnotherBtn(shadowRoot)
    initializeVerifyBtn(registryList)
    initializeDragNDrop(shadowRoot)
}

export const removeListeners = () => {
  listeners.forEach(listener=>
    listener.element.removeEventListener(listener.type, listener.handler)
  )
  listeners = null;
}