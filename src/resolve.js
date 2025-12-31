const resolveVC = async (cred)=>{
    try {
        const url = new URL(cred)
        const response = await fetch(url);
        return await response.json();
    } catch (e) {
        // It wasn't a URL, fine, continue on
        // and try to parse as json
    }
    // if it doesn't parse, let the error bubble up
    return JSON.parse(cred)
}

export default resolveVC