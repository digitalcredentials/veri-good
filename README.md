# veri-good

A [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) for verifying [Verifiable Credentials](https://www.w3.org/TR/vc-data-model-2.0/).

Web components are basically custom HTML tags and can be dropped into any HTML page, which you'd do like so for the veri-good element:

```
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>veri-good!</title>
  </head>
  <body>
    <div style="font-size: 20px"></div>
    <div style="padding: 5em">
      <veri-good registry-list="https://digitalcredentials.github.io/dcc-known-registries/known-did-registries.json"></veri-good>
    </div>
    <script type="module" src="=bundle.js"></script>
  </body>
</html>
```

You'll therefore need to have saved that bundle.js (which is in the dist directory of this repository) to your server.

If you are using a bundler (webpack,rollup,next,react,etc.) import the module which we've published to npm:

import '@digitalcredentials/veri-good'

The import automagically registers the component with the browser. Use the tag wherever you like.

We also provide a react wrapper around the tag which you also can import from the npm module:

import { VeriGood } from '@digitalcredentials/veri-good'

and then use like any other react element. 

More on the available props is in the [React Component](#react-component) section.

### Issuer Registry

 The registry-list is a list of registries against which to check the signing DID for each credential. For the moment it defaults to the above list, i.e.,
 
 ```https://digitalcredentials.github.io/dcc-known-registries/known-did-registries.json```
 
You can look at that list as an example of how to build your own.

You can instead programmatically set a simple list of DIDs like so:

  ```
 <body>
    <veri-good id="someID"></veri-good>
    <script type="module" src="=bundle.js"></script>
    <script>
        const listOfDIDs = {
            "did:web:digitalcredentials.github.io:testDID": {
                "issuerName": "Department of Chemistry",
                "url": "https://chemistry.uni.edu"
            },
            "did:key:z6Mki7DqKQswPsjqMVhP4W3n2ABFb5wBegZC5erEVg5qcgEw": {
                "name": "Departement of Economics",
                "url": "https://econ.uni.edu"
            }
        };
        document.getElementById('someID').setIssuerDIDs(listOfDIDs)
    </script>
</body>
 ```

The issuerName and url are displayed when verifying a credential issued by that DID.

### Programmatic Verification

You can programmatically set the VC to be verified by calling the 'verify' method on the element, like so:
 
 ```
 <body>
    <veri-good registry-list="https://digitalcredentials.github.io/dcc-known-registries/known-did-registries.json"></veri-good>
    <script type="module" src="=bundle.js"></script>
    <script>
      const verifier = document.querySelector('veri-good')
        verifier.addEventListener('veri-good-is-ready', (e) => {
          verifier.verify("https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didKey/legacy-noStatus-noExpiry-basicOBv3.json")
      });
    </script>
</body>
 ```

Notice that we have to wait for the web component to finish intializing, and fire the 'veri-good-is-ready' event before we can call the 'verify' method on it.

You can of course also (and more likely) directly use the call in your own javascript that you bundle up with webpack or the like. More on bundling below.

You might use the 'verify' call for cases like:

* immediately verifying a credential whose url has been passed in as a request parameter on your html page.
* verifying a credential that the end user selects from a list of credentials on the page, like say in a web wallet

The react wrapper compoent provides a verify prop that invokes the verify call under the covers. More on the available props is in the [React Component](#react-component) section.

### Attributes

There are a few attributes that you can set on the element:

* registry-list - which we talked about above

and some boolean valued attributes, all of which default to false:

* showMore - set true to show the 'more..' link that opens a dialog showing more detail about the credential.
* showIssuer - set true to show details about the issuer, which are taken from the registry-list you pass in.
* showDate - set true to show the awardedOn date from the credential
* bigger - set true to display a larger version of the verifier (600 x 800) rather than the default 380 X 450

### Customization

There are three 'slots' in the web component into which you can place custom html content:

* header
* wasAwarded
* awardedBy

Use them by including your custom content inside the `<veri-good>` tag like so:

```
<veri-good registry-list="https://digitalcredentials.github.io/dcc-known-registries/known-did-registries.json">
    <div slot="header">
        <div style="margin:.2em">University of Wonderful</div>
        <div style="font-size:1.2em">Course Credential Verification</div>
    </div>
    <div slot="wasAwarded">earned</div>
    <div slot="awardedBy">awarded byyyy</div>
</veri-good>
```

The slots map into the verifier like so:

TODO: add image of verifier with slots circled, arrows pointing to each with a label.

You'll of course likely have to play with the css to fit with everything else in the verifier.

If you don't provide content for the slots, the defaults will be used which look like so:

TODO: add image with default content.

### React Element

We provide a react element that wraps the web componet. You can use the react element like any other react element.

The web component attributes all map to react props. The web component public methods also map to react props.

The react props are therefore:

TODO add props here

Use the element like so:

TODO show example of using the props on the element, in particular the 'verify' prop.