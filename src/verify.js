import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { cryptosuite as eddsaRdfc2022CryptoSuite } from '@digitalbazaar/eddsa-rdfc-2022-cryptosuite';
import * as vc from '@digitalbazaar/vc';
import { securityLoader } from '@digitalcredentials/security-document-loader';
const documentLoader = securityLoader({ fetchRemoteContexts: true }).build();
const eddsaSuite = new DataIntegrityProof({ cryptosuite: eddsaRdfc2022CryptoSuite });
const ed25519Suite = new Ed25519Signature2020();
const suite = [ed25519Suite, eddsaSuite]

const verify = async (credential) => {
    let signature, expiry;
    try { 
        const verificationResult = await vc.verifyCredential({credential,suite,documentLoader});
        const expirationDate = (credential.validUntil || credential.expirationDate) ?
            new Date(credential.validUntil ?? credential.expirationDate) : 
            null
        if (!verificationResult.verified) {
            if (verificationResult.error?.message === 'Credential has expired.') {
                // run verification again, but with current time set to one
                // second before expiry to force the signature check
                const now = expirationDate.setSeconds(expirationDate.getSeconds() - 1); // subtract one second
                const sigCheck = await vc.verifyCredential({credential,suite,documentLoader,now});
                if (sigCheck.verified) {
                    signature = {valid: true, message: 'Signature is valid.'}
                    expiry = {valid: false, message: `Expired on: ${expirationDate.toDateString()}`}
                } else {
                    signature = {valid: false, message: 'Signature is not valid.'}
                }
            }
        } else {
            signature = {valid: true, message: 'Signature is valid.'}
            expiry = {valid: true, message: expirationDate ? `Valid until: ${expirationDate.toDateString()}` : 'No expiry date.'}
        }
    } catch (e) {
        console.log(e)
    }
    return {signature, expiry};
}

export default verify
