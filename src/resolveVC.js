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
            return {vc}
        } catch (e) {
            return {vc: null, error: "The url you provided couldn't be retrieved."}
        }
    }

    try {
        const vc = JSON.parse(cred)
        return {vc}
    } catch (e) {
        return {vc: null, error: "The credential you provided couldn't be processed."}
    }
}

export default resolveVC