import styles from './styles.js'
import render from './render.js'
import { getElement, setTemplate } from './displayUtils.js'
import { processDIDTemplateList, setIssuerDidList } from './issuerDids.js'
import { setHostElement } from './displayUtils.js'
import { initializeListeners, removeListeners } from './listeners.js'
import { fireExternalReadyEvent } from './events.js'

 
export default class VeriGood extends HTMLElement {

  /* static get observedAttributes() {
    return ['show'];
  } */

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

  //attributeChangedCallback(name, oldValue, newValue) {
  //  this.shadowRoot.innerHTML = render(this);
  //}

}

customElements.define('veri-good', VeriGood);
