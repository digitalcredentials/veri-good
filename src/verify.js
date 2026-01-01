import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { cryptosuite as eddsaRdfc2022CryptoSuite } from '@digitalbazaar/eddsa-rdfc-2022-cryptosuite';
import * as vc from '@digitalbazaar/vc';
import { securityLoader } from '@digitalcredentials/security-document-loader';
import checkStatusDirectly from './checkStatusDirectly.js';
import lookupIssuer from './lookupIssuer.js';
const documentLoader = securityLoader({ fetchRemoteContexts: true }).build();
const eddsaSuite = new DataIntegrityProof({ cryptosuite: eddsaRdfc2022CryptoSuite });
const ed25519Suite = new Ed25519Signature2020();
const suite = [ed25519Suite, eddsaSuite]

const verify = async (credential, knownDIDRegistries) => {
    let signature, expiry, status, issuer
    try {
        
        const checkStatus = ()=>{return {verified:true} }
        const verificationResult = await vc.verifyCredential({credential,suite,documentLoader,checkStatus});
    
        const expirationDate = (credential.validUntil || credential.expirationDate) ?
            new Date(credential.validUntil ?? credential.expirationDate) : 
            null

        if (!verificationResult.verified) {
            if (verificationResult.error?.message === 'Credential has expired.') {
                // run verification again, but with current time set to one
                // second before expiry to force the signature check
                const now = expirationDate.setSeconds(expirationDate.getSeconds() - 1); // subtract one second
                const sigCheck = await vc.verifyCredential({credential,suite,documentLoader,checkStatus,now});
                if (sigCheck.verified) {
                    signature = {valid: true, message: 'Signature is valid.'}
                    expiry = {valid: false, message: `Expired on: ${expirationDate.toDateString()}`}
                } else {
                    // just return right away because something prevented verifying the signature
                    return {signature: {valid: false, message: "The credential couldn't be verified. Please contact the issuer."}}
                }
            }
        } else {
            signature = {valid: true, message: 'Signature is valid.'}
            const expiryMessage = expirationDate ? `Valid until: ${expirationDate.toDateString()}` : 'No expiry date.'
            expiry = {valid: true, message: expiryMessage}
        }

        status = await checkStatusDirectly(credential)
        issuer = await lookupIssuer(credential.issuer, knownDIDRegistries)
        
    } catch (e) {
        console.log(e)
    }
    const finalResult = {signature, expiry, status, issuer};
    return finalResult;
}




export default verify
