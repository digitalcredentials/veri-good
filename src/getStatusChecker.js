import { checkStatus } from '@digitalbazaar/vc-bitstring-status-list';


const getStatusChecker = (credential) => {

  if (!credential.credentialStatus) {
    return null;
  }

  const {credentialStatus} = credential;
  const credentialStatuses = [].concat(credentialStatus)
  
 return credentialStatuses.some( status => status.type === 'BitstringStatusListEntry') ?
    checkStatus :
    ()=>{return {verified:true}} 
}

export default getStatusChecker