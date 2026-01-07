
import processCredential from './processCredential.js'

const listeners = {}

const initializeDragNDrop = (shadowRoot) => {
  const dropArea = shadowRoot.getElementById("drop-zone");
  const fileInput = dropArea.querySelector(".drop-zone__input");

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    shadowRoot.addEventListener(eventName, preventDefaults, false); 
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(
      eventName,
      () => dropArea.classList.add("drop-zone--over"),
      false
    );
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(
      eventName,
      () => dropArea.classList.remove("drop-zone--over"),
      false
    );
  });

  dropArea.addEventListener("drop", handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files; 
    handleFiles(files);
  }

  dropArea.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
  });

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

const initializeVerifyBtn = (component) => {
    component.verifyBtn = component.shadowRoot.querySelector("#verifyBtn");
    component.verifyBtn.addEventListener("click", () => {
        const pastedContent = component.shadowRoot.querySelector("#vc-paste").value
        processCredential(pastedContent, component.registryList);
    });  
}

export const initializeListeners = (component) => {
    initializeVerifyBtn(component)
    initializeDragNDrop(component.shadowRoot)
}

export const removeListeners = () => {
  listeners.verifyBtn.removeEventListener('click', this.handleClick);
  // TODO add other listeners
}