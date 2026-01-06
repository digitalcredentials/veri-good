//import { sampleVC } from './testcred.js'

import styles from './styles.js'
import render from './render.js'
import { setShadowRoot} from './displayUtils.js'
import processCredential from './processCredential.js'

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
    
    setShadowRoot(this.shadowRoot);

    this.verifyBtn = this.shadowRoot.querySelector("#verifyBtn");

    this.verifyBtn.addEventListener("click", () => {
        const pastedContent = this.shadowRoot.querySelector("#vc-paste").value
        processCredential(pastedContent, this.registryList);
    });   
  }

  disconnectedCallback() {
    this.verifyBtn.removeEventListener('click', this.handleClick);
  }

  //attributeChangedCallback(name, oldValue, newValue) {
  //  this.shadowRoot.innerHTML = render(this);
  //}

}

customElements.define('veri-good', VeriGood);