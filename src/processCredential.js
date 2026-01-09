import verify from './verify.js'
import displayStepResults from './displayStepResults.js'
import resolveVC from './resolveVC.js'
import {showVerifyingSpinner, hideVerifyingSpinner, setSpinnerMessage} from './verifyingSpinner.js'
import { sleep, displayError } from './displayUtils.js'

const processCredential = async (credential) => {

    showVerifyingSpinner()

    const [{vc,error}] = await Promise.all([
      resolveVC(credential),
      sleep()
    ]);

    if (error) {
      displayError(error)
      return
    }

    setSpinnerMessage("Verifying...")

     const [verificationResult] = await Promise.all([
      verify(vc),
      sleep()
    ]);

    hideVerifyingSpinner()

    displayStepResults(verificationResult)
}

export default processCredential