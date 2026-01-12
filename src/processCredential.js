import verify from './verify.js'
import displayResults from './displayResults.js'
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

    displayResults(verificationResult)
}

export default processCredential