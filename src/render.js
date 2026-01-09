import {VERIFYING_SIG_MSG, VERIFYING_EXP_MSG, VERIFYING_REV_MSG} from './constants.js'

const expired = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didKey/oidf-noStatus-expired.json"
const expiredAndRevoked = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didKey/oidf-revokedStatus-expired.json"
const revoked = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didWeb/legacy-revokedStaus-noExpiry.json"
const notRevoked = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/ed25519/didWeb/legacy-validStatus-noExpiry.json"
const render = x => `
  <div class="header">
    <slot name="header">
        <div style="margin:.3em">University of Wonderful</div>
        <div style="font-size:1.2em">Course Credential Verification</div>
    </slot>
  </div>

   <div id="details-container" class="hide-on-reset">
        <div id="holder-name" class="to-clear"></div>
        <slot name="wasAwarded">
            <div class="cred-label">was awarded a</div>
        </slot>
        <div id="cred-name" class="to-clear"></div>
        <slot name="awardedBy">
            <div class="cred-label">by the</div>
        </slot>
        <div id="issuer-name" class="to-clear"></div>
        <div id="more-link">More..</div>
        <dialog id="more-dialog">Show some stuff here like the criteria, validFrom</div>
    </div>


    <div id="input-container" class="show-on-reset">
        <div>
            <textarea id="vc-paste" class="vc-area" placeholder="Paste your credential, or a url pointing to it.">${expired}</textarea>
        </div>
        <div class="drop-zone" id="drop-zone">
            <span class="drop-zone__prompt">Drag file here or click to upload</span>
            <input type="file" name="myFile" class="drop-zone__input">
        </div>
    </div>
  
     <div id="verify-spinner">
                <div class="big-circle-loader"></div>
                <div id="spinner-message">Preparing to verify your credential...</div>    
    </div>

    <div id="error-container" class="hide-on-reset">
        <div class='error-lines'>Something went wrong - please try again. </div>
        <div class='error-lines'>Be sure that you are pasting in a valid Verifiable Credential or a link to
            a valid Verifiable Credential.</div>
        </div>
        <div id="error-message" class="to-clear hide-on-reset"></div>
    </div>

    <div id="result-container" class="hide-on-reset hide-on-reset">
        <div id="result-list">
            <div id="sigCheck" class="resultLine">
                <div class="circle-loader">
                    <div class="checkmark draw"></div>
                    <div class="cross"></div>
                </div>
                <div id="sig-message" class="message" >${VERIFYING_SIG_MSG}</div>
            </div>
            <div id="expiryCheck" class="resultLine hide-on-reset" >
                <div class="circle-loader"  >
                    <div class="checkmark draw" ></div>
                    <div class="cross"></div>
                </div>
                <div id="exp-message" class="message" >${VERIFYING_EXP_MSG}</div>
            </div>
            <div id="statusCheck" class="resultLine hide-on-reset" >
                <div class="circle-loader" >
                    <div class="checkmark draw"></div>
                    <div class="cross"></div>
                </div>
                <div id="rev-message" class="message" >${VERIFYING_REV_MSG}</div>
            </div>
        </div>
    </div>

    
 

  
  <div id="button-container">
    <button class="btn show-on-reset" id="verifyBtn"><div class="check"></div>Verify</button>
    <button class="btn hide-on-reset" id="verifyAnotherBtn"><div class="check"></div>Verify Another</button>
  </div>
`;

export default render