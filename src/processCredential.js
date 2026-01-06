import verify from './verify.js'
import displayStepResults from './displayStepResults.js'
import resolveVC from './resolveVC.js'
import {showVerifyingSpinner, hideVerifyingSpinner, setSpinnerMessage} from './verifyingSpinner.js'
import { sleep } from './displayUtils.js'

const processCredential = async (credential, knownDIDRegistries) => {

    showVerifyingSpinner()

    const [{vc,error}] = await Promise.all([
      resolveVC(credential),
      sleep(1500)
    ]);

    if (error) {
      displayError(error)
      return
    }

    setSpinnerMessage("Verifying...")

     const [verificationResult] = await Promise.all([
      verify(vc, knownDIDRegistries),
      sleep(1500)
    ]);

    hideVerifyingSpinner()

    displayStepResults(verificationResult)
}

export default processCredential