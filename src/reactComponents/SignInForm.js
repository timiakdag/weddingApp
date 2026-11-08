import { useState } from "react";

import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  auth,
  googleProvider
} from "../firebase";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(
        auth,
        googleProvider
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmailSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">
        Sign In
      </h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="w-full border p-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        className="w-full border p-2"
      />

      <button
        onClick={handleEmailSignIn}
        className="w-full border p-2"
      >
        Sign In
      </button>

      <button
        onClick={handleEmailSignUp}
        className="w-full border p-2"
      >
        Create Account
      </button>

      <button
        onClick={handleGoogleSignIn}
        className="w-full border p-2"
      >
        Sign In With Google
      </button>
    </div>
  );
}