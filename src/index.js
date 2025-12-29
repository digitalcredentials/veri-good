import { sampleVC } from './testcred.js';
import { verify } from './verify.js';
import { displayResults } from './displayResults.js';

const styles = new CSSStyleSheet();

styles.replaceSync(`
  :host {
    --default-color: green;
    --default-radius: 6px;
    --default-depth: 5px;

    display: inline-block;
    contain: content;
    color: white;
    background: var(--color, var(--default-color));
    border-radius: var(--radius, var(--default-radius));
    min-width: 325px;
    max-width: 800px;
    text-align: center;
    box-shadow: 0 0 var(--depth, var(--default-depth)) rgba(0,0,0,.5);
  }

  .header {
    margin: 16px 0;
    position: relative;
  }

  h3 {
    font-weight: bold;
    font-family: sans-serif;
    letter-spacing: 4px;
    font-size: 32px;
    margin: 0;
    padding: 0;
  }

  h4 {
    font-family: sans-serif;
    font-size: 18px;
    margin: 0;
    padding: 0;
  }

  .body {
    background: white;
    color: black;
    padding: 32px 8px;
    font-size: 20px;
    font-family: sans-serif;
  }

  .footer {
    height: 16px;
    background: var(--color, var(--default-color));
    border-radius: 0 0 var(--radius, var(--default-radius)) var(--radius, var(--default-radius));
  }

  .vc-area {
    height: 300px;
    width: 600px;
    }

  .result-list {
    list-style-type: disc;
    padding-left: 20px;
}

`);

const verifyCredential = async (resultContainer, inputContainer, credential) => {
     const response = await fetch("https://digitalcredentials.github.io/dcc-known-registries/known-did-registries.json");
      const knownDIDRegistries = await response.json();
    // const result = await verifierCore.verifyCredential({
     // credential,
     // knownDIDRegistries: knownDIDRegistries
    // }); 
    const result = await verify(credential)
   displayResults(result, resultContainer, inputContainer)
}

const render = x => `
  <div part="header" class="header">
  <slot></slot>
    <h3 part="greeting">Digital Credentials Consortium</h3>
    <h4 part="message">Verifiable Credential Verfication</h4>
  </div>

  <div part="body" class="body">
    <div id="inputCont">
    <textarea class="vc-area" placeholder="Paste your credential, or a url pointing to it."></textarea>
    <button id="verifyBtn">Verify</button>
    </div>
    <div id="resultCont">
      <ul id="resultList" hidden>
        <li id="signatureResult" hidden>Signature is valid!</li>
        <li id="expiryResult" hidden>Hasn't expired!</li>
        <li id="statusResult" hidden>Hasn't been reovked!</li>
        <li id="registryResult" hidden>Was signed by (issuer name from registry will go here)</li>
      </ul>
    </div>
  </div>
  
  <div part="footer" class="footer"></div>
`;

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
    this.shadowRoot.innerHTML = render(this);
    
    this.verifyBtn = this.shadowRoot.querySelector("#verifyBtn");
    this.resultContainer = this.shadowRoot.querySelector("#resultCont");
    this.inputContainer = this.shadowRoot.querySelector("#inputCont");
    this.verifyBtn.addEventListener("click", () => {
        verifyCredential(this.resultContainer, this.inputContainer, sampleVC);
    });
  }

  disconnectedCallback() {
    // Remove the event listener when the component is removed from the DOM
    this.verifyBtn.removeEventListener('click', this.handleClick);
  }

  //attributeChangedCallback(name, oldValue, newValue) {
  //  this.shadowRoot.innerHTML = render(this);
  //}

}

customElements.define('veri-good', VeriGood);