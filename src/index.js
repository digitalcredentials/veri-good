import styles from './styles.js'
import render from './render.js'
import { getElement } from './displayUtils.js'
import { setHostElement } from './displayUtils.js'
import { initializeListeners, removeListeners } from './listeners.js'
import { fireExternalReadyEvent } from './events.js'

const DEFAULT_REGISTRY_LIST = 'https://digitalcredentials.github.io/dcc-known-registries/known-did-registries.json'

class VeriGood extends HTMLElement {

  static get observedAttributes() {
    return ['registry-list'];
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

  get registryList() {
    return this.getAttribute('registry-list');
  }

  set registryList(value) {
    this.setAttribute('registry-list', value);
  }

  connectedCallback() {
    if (!this.registryList) {
      this.registryList = DEFAULT_REGISTRY_LIST;
    }
    this.shadowRoot.innerHTML = render();
    setHostElement(this);
    initializeListeners(this.shadowRoot, this.registryList);
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