import { RegistryClient } from "@digitalcredentials/issuer-registry-client";

const registryClient = new RegistryClient();

const lookupIssuer = async (issuer, knownDIDRegistries) => {
  const issuerDid = typeof issuer === "string" ? issuer : issuer.id;
  const response = await fetch(knownDIDRegistries);
  const registries = await response.json();
  await registryClient.use({ registries });
  const { matchingIssuers, uncheckedRegistries } =
    await registryClient.lookupIssuersFor(issuerDid);
  if (!!matchingIssuers.length) {
    // match found
    return {
      valid: true,
      message: `Issued by ${matchingIssuers[0].issuer.federation_entity.organization_name}`,
    };
  } else {
    // no match
    if (!!uncheckedRegistries.length) {
      // but some registries couldn't be loaded
      return {
        valid: false,
        errorCode: "incomplete_lookup",
        message: "Technical problems prevented confirmation of the issuer.",
      };
    } else {
      // not in any registry
      return {
        valid: false,
        errorCode: "unknown_issuer",
        message: "Not a known issuer.",
      };
    }
  }
};

export default lookupIssuer;
