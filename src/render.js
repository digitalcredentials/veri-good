const render = x => `
  <div part="header" class="header">
    <slot></slot>
    <h3 part="greeting">Digital Credentials Consortium</h3>
    <h4 part="message">Verifiable Credential Verfication</h4>
  </div>

  <div part="body" class="body">
    <div id="inputCont">
        <div>
            <textarea class="vc-area" placeholder="Paste your credential, or a url pointing to it."></textarea>
        </div>
        <button id="verifyBtn">Verify</button>
    </div>
  
    <div id="resultCont" hidden>
        <div id="result-list">
            <div id="sigCheck" class="resultLine">
                <div class="circle-loader">
                    <div class="checkmark draw"></div>
                </div>
                <div id="sigMessage" >Verifying signature...</div>
            </div>
            <div id="expiryCheck" hidden >
                <div class="circle-loader"  >
                    <div class="checkmark draw"></div>
                </div>
            </div>
            <div id="statusCheck" hidden>
                <div class="circle-loader" >
                    <div class="checkmark draw"></div>
                </div>
            </div>
            <div id="registryCheck" hidden >
                <div class="circle-loader">
                    <div class="checkmark draw"></div>
                </div>
            </div>    
        </div>
    </div>
 
</div>
  
  <div part="footer" class="footer">BLh blhg blah</div>
`;

export default render