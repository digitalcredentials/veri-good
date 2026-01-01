//import { sampleVC } from './testcred.js'
import verify from './verify.js'
import displayResults from './displayResults.js'
import styles from './styles.js'
import render from './render.js'
import resolveVC from './resolveVC.js'

const DEFAULT_REGISTRY_LIST = 'https://digitalcredentials.github.io/dcc-known-registries/known-did-registries.json'

const verifyCredential = async (shadowRoot, credential, knownDIDRegistries) => {
    const vc = await resolveVC(credential);
    const result = await verify(vc, knownDIDRegistries)
    displayResults(result, shadowRoot)
}

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
    
    this.verifyBtn = this.shadowRoot.querySelector("#verifyBtn");

    this.verifyBtn.addEventListener("click", () => {
        const vc = this.shadowRoot.querySelector("#vc-paste").value
        verifyCredential(this.shadowRoot, vc, this.registryList);
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