import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { cryptosuite as eddsaRdfc2022CryptoSuite } from '@digitalbazaar/eddsa-rdfc-2022-cryptosuite';
import * as vc from '@digitalbazaar/vc';
import { securityLoader } from '@digitalcredentials/security-document-loader';
const documentLoader = securityLoader({ fetchRemoteContexts: true }).build();
const eddsaSuite = new DataIntegrityProof({ cryptosuite: eddsaRdfc2022CryptoSuite });
const ed25519Suite = new Ed25519Signature2020();
const suite = [ed25519Suite, eddsaSuite]
export const verify = async (credential) => await vc.verifyCredential({credential,suite,documentLoader});

