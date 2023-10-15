import "./AdminSignIn.css";
import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../FirebaseConfig";
import { useEffect, useRef } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { MainUseContext } from "../../context/MainContext";

export default function Admin() {
  const navigate = useNavigate();
  const auth = getAuth();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [error, setError] = useState(null);
  // const { user, setUser } = MainUseContext();

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setUser(user);
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  const handleSignIn = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        console.log("user logged in:", cred.user);
        // setAuthenticated(true);
        console.log("user", cred.user);
        // setUser(cred.user);
        navigate("/choose-building");
      })
      .catch((err) => {
        setError("Invalid username or password");
        // setAuthenticated(false); // Sets authentication status to false
      });
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        console.log("user logged out");
        // setUser(null);
      })

      .catch((err) => console.log(err.message));
  };

  return (
    <div className="signUp-container">
      <form className="login-form" onSubmit={handleSignIn}>
        <label htmlFor="emal">email:</label>
        <input type="email" name="email" ref={emailRef} />
        <label htmlFor="password">password:</label>
        <input type="password" name="password" ref={passwordRef} />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="sign-in-btn">
          SignIn
        </button>
        <button onClick={handleSignOut}>sign out</button>
      </form>
    </div>
  );
}
