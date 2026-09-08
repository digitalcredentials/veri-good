// Wallets usually export a credential wrapped in a VerifiablePresentation
// envelope; verification applies to the enclosed credential.
const unwrapPresentation = (vc) => {
    const types = [].concat(vc?.type ?? [])
    if (!types.includes('VerifiablePresentation')) {
        return {vc}
    }
    const enclosed = [].concat(vc.verifiableCredential ?? [])
    if (!enclosed.length) {
        return {vc: null, error: "The presentation you provided doesn't contain a credential."}
    }
    return {vc: enclosed[0]}
}

const resolveVC = async (cred)=>{
    let url;
    try {
        url = new URL(cred)
    } catch (e) {
        // It wasn't a URL, fine, continue on
        // and try to parse as json
    }

    if (url) {
        try {
            const response = await fetch(url);
            const vc = await response.json();
            return unwrapPresentation(vc)
        } catch (e) {
            return {vc: null, error: "The url you provided couldn't be retrieved."}
        }
    }

    try {
        const vc = JSON.parse(cred)
        return unwrapPresentation(vc)
    } catch (e) {
        return {vc: null, error: "The credential you provided couldn't be processed."}
    }
}

export default resolveVC