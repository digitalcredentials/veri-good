const expired = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didKey/oidf-noStatus-expired.json"
const expiredAndRevoked = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didKey/oidf-revokedStatus-expired.json"
const revoked = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didWeb/legacy-revokedStaus-noExpiry.json"
const notRevoked = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/ed25519/didWeb/legacy-validStatus-noExpiry.json"

const render = x => `
  <div part="header" class="header">
    <slot></slot>
    <h3 part="greeting">Digital Credentials Consortium</h3>
    <h4 part="message">VC Verifier</h4>
  </div>

   <div id="detailsCont" class="details-cont">
        <div id="holder-name"></div>
        <div id="was-awarded" class="cred-label">was awarded</div>
        <div id="cred-name"></div>
        <div id="awarded-by" class="cred-label">by</div>
        <div id="issuer-name"></div> 
    </div>

  <div part="body" class="body">

    <div id="inputCont">
        <div>
            <textarea id="vc-paste" class="vc-area" placeholder="Paste your credential, or a url pointing to it.">${expired}</textarea>
        </div>
        <button class="btn" id="verifyBtn"><div class="check"></div>Verify</button>
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
                    <div class="cross"></div>
                </div>
                <div class="message" >Verifying signature...</div>
            </div>
            <div id="expiryCheck" class="resultLine" >
                <div class="circle-loader"  >
                    <div class="checkmark draw" ></div>
                    <div class="cross"></div>
                </div>
                <div class="message" >Checking expiration...</div>
            </div>
            <div id="statusCheck" class="resultLine" >
                <div class="circle-loader" >
                    <div class="checkmark draw"></div>
                    <div class="cross"></div>
                </div>
                <div class="message" >Checking revocation status...</div>
            </div>
            <div id="issuerCheck" class="resultLine"  >
                <div class="circle-loader">
                    <div class="checkmark draw"></div>
                    <div class="cross"></div>
                </div>
                <div class="message" >Verifying issuer...</div>
            </div>    
        </div>
    </div>
 
</div>
  
  <div part="footer" class="footer"></div>
`;

export default render