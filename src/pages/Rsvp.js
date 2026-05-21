import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import { auth } from "../firebase";

import SignInForm from "../reactComponents/SignInForm";
import UserPanel from "../reactComponents/UserPanel";

function Rsvp(){
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
      });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
  };

    return(<div>
            <h1 className="text-3xl text-center">Rsvp</h1>
            {!user ? (
        <SignInForm />
      ) : (
        <UserPanel
          user={user}
          onSignOut={handleSignOut}
        />
      )}
          </div>);
}

export default Rsvp;

//var firebase = require('firebase');
//var firebaseui = require('firebaseui');
//// Initialize the FirebaseUI Widget using Firebase.
//var ui = new firebaseui.auth.AuthUI(firebase.auth());

/*
ui.start('#firebaseui-auth-container', {
  signInOptions: [
  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
      requireDisplayName: false
      
    }
  ]
});
*/


/*
define scopes:

ui.start('#firebaseui-auth-container', {
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: [
        'https://www.googleapis.com/auth/contacts.readonly'
      ],
      customParameters: {
        // Forces account selection even when one account
        // is available.
        prompt: 'select_account'
      }
    },
*/

/*
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
      requireDisplayName: false
      
    }],};
  */

    