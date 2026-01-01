import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { cryptosuite as eddsaRdfc2022CryptoSuite } from '@digitalbazaar/eddsa-rdfc-2022-cryptosuite';
const eddsaSuite = new DataIntegrityProof({ cryptosuite: eddsaRdfc2022CryptoSuite });
const ed25519Suite = new Ed25519Signature2020();
const suite = [ed25519Suite, eddsaSuite]
import * as vc from '@digitalbazaar/vc';

import {extendContextLoader} from 'jsonld-signatures';
import { checkStatus } from '@digitalbazaar/vc-bitstring-status-list';

// we need to use our own document loader
// so we can run the fetch to get the
// status list, without preflight calls
// that cause CORS errors
const {defaultDocumentLoader} = vc;
const statusDocumentLoader = extendContextLoader(async url => {
  if(url.startsWith('http')) {
    const response = await fetch(url);
    const document = await response.json();
    return {
      contextUrl: null,
      documentUrl: url,
      document
    };
  }
  return defaultDocumentLoader(url);
});

const checkStatusDirectly = async (credential) => {
    if (credential.credentialStatus) {
        const checkStatus = getStatusChecker(credential)
        const statusResult = await checkStatus({credential, documentLoader: statusDocumentLoader, suite, verifyMatchingIssuers: false, verifyBitstringStatusListCredential: false})
        // the result.status is 'true' if revoked
        const isRevoked = statusResult.results.some(result=>result.status)
        if (isRevoked) {
            return {valid: false, message: 'Has been revoked'}
        } else {
            return {valid: true, message: 'Has not been revoked'}
        }
    } else {
        return {valid: true, message: 'Has not been revokeddddd'}
    }
}


const getStatusChecker = (credential) => {
  if (!credential.credentialStatus) return null;
  const {credentialStatus} = credential;
  const credentialStatuses = [].concat(credentialStatus)
 return credentialStatuses.some( status => status.type === 'BitstringStatusListEntry') ?
    checkStatus :
    ()=>{return {verified:true}} 
}

export default checkStatusDirectly