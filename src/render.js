const expiredVC = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didKey/oidf-noStatus-expired.json"

const render = x => `
  <div part="header" class="header">
    <slot></slot>
    <h3 part="greeting">Digital Credentials Consortium</h3>
    <h4 part="message">Verifiable Credential Verfication</h4>
  </div>

  <div part="body" class="body">
    <div id="inputCont">
        <div>
            <textarea id="vc-paste" class="vc-area" placeholder="Paste your credential, or a url pointing to it.">${expiredVC}</textarea>
        </div>
        <button id="verifyBtn">Verify</button>
    </div>
  
    <div id="errorCont" hidden>
        <div>
            Something went wrong. Please try again. Be sure that you are pasting in a valid Verifiable Credential or a link to
            a valid Verifiable Credential.
        </div>
        <button id="retryBtn">Retry</button>
    </div>

    <div id="resultCont" hidden>
        <div id="result-list">
            <div id="sigCheck" class="resultLine">
                <div class="circle-loader">
                    <div class="checkmark draw"></div>
                </div>
                <div class="message" >Verifying signature...</div>
            </div>
            <div id="expiryCheck" hidden >
                <div class="circle-loader"  >
                    <div class="checkmark draw"></div>
                    <div class="cross">&#10060;</div>
                </div>
                <div class="message" >Checking expiration...</div>
            </div>
            <div id="statusCheck" hidden>
                <div class="circle-loader" >
                    <div class="checkmark draw"></div>
                    <div class="cross">&#10060;</div>
                </div>
                <div class="message" >Checking revocation status...</div>
            </div>
            <div id="registryCheck" hidden >
                <div class="circle-loader">
                    <div class="checkmark draw"></div>
                    <div class="cross">&#10060;</div>
                </div>
                <div class="message" >Verifying issuer...</div>
            </div>    
        </div>
    </div>
 
</div>
  
  <div part="footer" class="footer">BLh blhg blah</div>
`;

export default render