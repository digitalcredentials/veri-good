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
    try { 
        const result = await vc.verifyCredential({credential,suite,documentLoader});
        if (!result.verified) {
            console.log("not verified")
            console.log(result.error.message)
            if (result.error?.message === 'Credential has expired.') {
                // run verification again, but with current time set to one
                // second before expiry to force the signature check
                const expirationDate = new Date(credential.validUntil ?? credential.expirationDate)
                const now = expirationDate.setSeconds(expirationDate.getSeconds() - 1); // subtract one second
                const sigCheck = await vc.verifyCredential({credential,suite,documentLoader,now});
                if (sigCheck.verified) {
                    return {signatureValid:true, expired: true}
                } else {
                    return {signatureValid:false}
                }
            }
        } else {
            return {signatureValid:true, expired: false}
        }
    } catch (e) {
        console.log(e)
    }
}

export default verify
