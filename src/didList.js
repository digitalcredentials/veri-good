import { getElement } from "./displayUtils.js";

/* The did list is passed into the web component as a template with id set to issuer-dids.
See the index.html for an example.
If a did list is passed in to the component (via a template), it overrides the values set here.
*/
let didList = {
            "did:web:digitalcredentials.github.io:testDID": {
                "issuerName": "Department of Chemistry",
                "url": "https://chemistry.uni.edu"
            },
            "did:web:digitalcredentials.github.io:vc-test-fixtures:dids:legacy": {
                "issuerName": "Department of Biology",
                "url": "https://chemistry.uni.edu"
            },
            "did:key:z6MkjoriXdbyWD25YXTed114F8hdJrLXQ567xxPHAUKxpKkS": {
                "issuerName": "Department of Economics",
                "url": "https://econ.uni.edu"
            },
            "did:key:z6MkqBcwQ7qnRBRpgtsJQviLFeYxExMUE2k9nwKkMTF3DdRZ": {
                "issuerName": "Department of Computer Science",
                "url": "https://compsci.uni.edu"
            },
            "did:key:z6MknNQD1WHLGGraFi6zcbGevuAgkVfdyCdtZnQTGWVVvR5Q": {
                "issuerName": "Department of History",
                "url": "https://history.uni.edu"
            }
          };


export const processDIDList = (component) => {
    const didListTemplate = component.querySelector('#issuer-dids');
    if (didListTemplate) {
      try {
        didList = JSON.parse(didListTemplate.content.textContent.trim());
      }catch (e) {
        console.error(`Bad, or no <template id="did-list"> See the readme.`, e);
      }
    }
}

export const lookupIssuer = (issuer) => {
    const did = typeof issuer === "string" ? issuer : issuer.id;
    const matchingEntry = didList[did]
    if (matchingEntry) {
        return {
            valid: true,
            message: matchingEntry.issuerName
        };
    } else {
        return {
            valid: false,
            errorCode: "unknown_issuer",
            message: "Not a known issuer.",
        };
    }
}