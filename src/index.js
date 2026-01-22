import styles from './styles.js'
import render from './render.js'
import { getElement, setDisablePauses } from './displayUtils.js'
import { processDIDTemplateList, setIssuerDidList } from './issuerDids.js'
import { setHostElement } from './displayUtils.js'
import { initializeListeners, removeListeners } from './listeners.js'
import { fireExternalReadyEvent } from './events.js'

 
export default class VeriGood extends HTMLElement {

  static get observedAttributes() {
    return ['disable-pauses'];
  } 

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [
      ...this.shadowRoot.adoptedStyleSheets,
      styles
    ];
  }

  verify(vc) { 
    getElement("#vc-paste").value = vc; 
    getElement('#verifyBtn').click()
  }

  setIssuerDids(list) {
    setIssuerDidList(list)
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = render();
    setHostElement(this);
    processDIDTemplateList(this);
    initializeListeners(this.shadowRoot);
    fireExternalReadyEvent(this);
  }

  disconnectedCallback() {
    removeListeners()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disable-pauses') {
     // if it is present, it is true
      setDisablePauses(true);
    }
  }


}

customElements.define('veri-good', VeriGood);
