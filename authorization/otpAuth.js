
// Require the Firebase client library
// const firebase = require('firebase/auth');

const { getAuth, signInWithPhoneNumber , PhoneAuthProvider } = require("firebase/auth");
const auth = require('../authorization/smsSend');
// const firebase = require('firebase/auth')
// Get the authentication service
// const auth = firebase.AuthCredential()
    // Send a verification code to the user's phone\


function sendOtp(phoneNumber){
    
    // method 1

    // auth.sendSignInLinkToPhoneNumber(phoneNumber, actionCodeSettings)
    // .then(function() {
    //     // The verification code has been sent to the user's phone
    // })
    // .catch(function(error) {
    //     // An error occurred while sending the verification code

    // })
    // window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container');
    // if (typeof window !== 'undefined') window = new RecaptchaVerifier('recaptcha-container');

    // var applicationVerifier = new firebase.RecaptchaVerifier('recaptcha-container')
    // console.log(applicationVerifier)


    // method 2

    signInWithPhoneNumber( auth , "+919080358869" , true )
    .then((confirmationResult)=>{
        console.log(confirmationResult)
        return confirmationResult
        // res.status(200) .json({ 
        //     message: `OTP ${phoneNumber} send successfully` 
        // });
    })
    .catch((err) => {
        console.error(err);
        return err
        // res.status(500).json({ 
        //     error: err 
        // });
    })

     // method 3
    //  var applicationVerifier = new firebase.RecaptchaVerifier('recaptcha-container')
    //  var provider = new firebase.PhoneAuthProvider()
    //  provider.verifyPhoneNumber('+919080358869' , applicationVerifier)
    //  .then((verificationID)=>{
    //     console.log(verificationID)
    //     return verificationID
    //  })
    //    .catch((err) => {
    //     console.error(err);
    //     return err
    // })

}

function verifyOTP(phoneNumber , verificationCode){
  // Sign the user in using the verification code they received on their phone
  auth.signInWithPhoneNumber(phoneNumber, verificationCode)
  .then(function(result) {
      // The user has been signed in
  })
  .catch(function(error) {
      // An error occurred while signing the user in
  });

}

module.exports = { sendOtp , verifyOTP}
   
  