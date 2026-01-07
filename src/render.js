const expired = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didKey/oidf-noStatus-expired.json"
const expiredAndRevoked = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didKey/oidf-revokedStatus-expired.json"
const revoked = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didWeb/legacy-revokedStaus-noExpiry.json"
const notRevoked = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/ed25519/didWeb/legacy-validStatus-noExpiry.json"

const render = x => `
  <div class="header">
    <slot></slot>
    <div class="title">Digital Credentials Consortium</div>
    <div class="title">Verification</div>
  </div>

   <div id="details-container">
        <div id="holder-name"></div>
        <div id="was-awarded" class="cred-label" >was awarded</div>
        <div id="cred-name"></div>
        <div id="awarded-by" class="cred-label" >by</div>
        <div id="issuer-name"></div> 
    </div>


    <div id="input-container">
        <div>
            <textarea id="vc-paste" class="vc-area" placeholder="Paste your credential, or a url pointing to it.">${expired}</textarea>
        </div>
        <div class="drop-zone" id="drop-zone">
            <span class="drop-zone__prompt">Drag file here or click to upload</span>
            <input type="file" name="myFile" class="drop-zone__input">
        </div>
        <button class="btn" id="verifyBtn"><div class="check"></div>Verify</button>
    </div>
  
     <div id="verify-spinner">
                <div class="big-circle-loader"></div>
                <div id="spinner-message">Preparing to verify your credential...</div>    
    </div>

    <div id="error-container">
        <div>
            Something went wrong. Please try again. Be sure that you are pasting in a valid Verifiable Credential or a link to
            a valid Verifiable Credential.
        </div>
        <div id="error-message"></div>
        <button id="retryBtn">Retry</button>
    </div>

    <div id="result-container">
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
        </div>
    </div>
 

  
  <div part="footer" class="footer"></div>
`;

export default render