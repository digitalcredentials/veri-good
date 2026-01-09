import { getElement } from "./displayUtils.js";

/* The did list is passed into the web component as a template with id set to issuer-dids.
See the index.html for an example.
If no did list is passed in, the default value, set below, is used.
*/
let didList = {
            "did:web:digitalcredentials.github.io:testDID": {
                "issuerName": "Department of Chemistry",
                "url": "https://chemistry.uni.edu"
            },
            "did:key:z6MkjoriXdbyWD25YXTed114F8hdJrLXQ567xxPHAUKxpKkS": {
                "name": "Department of Economics",
                "url": "https://econ.uni.edu"
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
    console.log("the did list:", didList)
    const did = typeof issuer === "string" ? issuer : issuer.id;
    if (didList[did]) {
        return {
            valid: true,
            message: didList.issuerName
        };
    } else {
        return {
            valid: false,
            errorCode: "unknown_issuer",
            message: "Not a known issuer.",
        };
    }
}