import * as verifierCore from '@digitalcredentials/verifier-core';
import {sampleVC} from './testcred.js';
import { verify } from './verify.js';

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
    font-size: 42px;
    font-family: cursive;
  }

  .footer {
    height: 16px;
    background: var(--color, var(--default-color));
    border-radius: 0 0 var(--radius, var(--default-radius)) var(--radius, var(--default-radius));
  }

  .vc-area {
    height: 100px;
    width: 200px;
    }

  .list {
    list-style-type: disc;
    padding-left: 20px;
}

`);

const verifyCredential = async (credential) => {
     const response = await fetch("https://digitalcredentials.github.io/dcc-known-registries/known-did-registries.json");
      const knownDIDRegistries = await response.json();
    // const result = await verifierCore.verifyCredential({
     // credential,
     // knownDIDRegistries: knownDIDRegistries
    // }); 
    const result = await verify(credential)
    console.log("the result")
    console.log(result)
}

const render = x => `
  <div part="header" class="header">
    <h3 part="greeting">${x.registryList.toUpperCase()}</h3>
    <h4 part="message">Verifiable Credential verfication</h4>
  </div>

  <div part="body" class="body">
    <slot></slot>
    <textarea class="vc-area" placeholder="paste your credential or a url pointing to it"></textarea>
  </div>
  <button id="verifyBtn">Verify</button>
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
    // Get the button element within this specific component instance
    this.verifyBtn = this.shadowRoot.querySelector("#verifyBtn");

                // Add a click event listener
                // Using an arrow function maintains the 'this' context of the class
                this.verifyBtn.addEventListener("click", () => {
                    verifyCredential(sampleVC);
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