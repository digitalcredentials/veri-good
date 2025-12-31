import { sampleVC } from './testcred.js'
import verify from './verify.js'
import displayResults from './displayResults.js'
import styles from './styles.js'
import render from './render.js'
import resolveVC from './resolve.js'

const verifyCredential = async (shadowRoot, credential) => {
    const response = await fetch("https://digitalcredentials.github.io/dcc-known-registries/known-did-registries.json");
    const knownDIDRegistries = await response.json();
    const vc = await resolveVC(credential);

    const result = await verify(vc)
        console.log("the result:")
    console.log(result)
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
      this.registryList = 'https://digitalcredentials.github.io/dcc-known-registries/known-did-registries.json';
    }
    this.shadowRoot.innerHTML = render();
    
    this.verifyBtn = this.shadowRoot.querySelector("#verifyBtn");

    this.verifyBtn.addEventListener("click", () => {
        const vc = this.shadowRoot.querySelector("#vc-paste").value
        verifyCredential(this.shadowRoot, vc);
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