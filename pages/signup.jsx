import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
// import styles from "../styles/Account.module.css";
import { useRouter } from "next/router";
import Header from "../components/header";
// import Footer from "../components/footer";

export default function Signup(props) {
  const router = useRouter();
  const [
    { firstName, lastName, email, phoneNumber, password, "confirm-password": confirmPassword },
    setForm,
  ] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    "confirm-password": "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      "confirm-password": confirmPassword,
      ...{ [e.target.name]: e.target.value.trim() },
    });
  }
  async function handleCreateAccount(e) {
    e.preventDefault();
    if (!(firstName && lastName && email && phoneNumber)) return setError("Must include first and last name, email, and phone number");
    if (password !== confirmPassword) return setError("Passwords must Match");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, phoneNumber, password }),
      });
      if (res.status === 200) return router.push("/");
      const { error: message } = await res.json();
      setError(message);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      <Head>
        <title>Self-Care POC</title>
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.firstName} />

      <main>
      <div>
        <h1>
        Create an Account!
        </h1>

        <form
          onSubmit={handleCreateAccount}
        >
          <label htmlFor="firstName">First Name: </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            onChange={handleChange}
            value={firstName}
          />
         <label htmlFor="lastName">Last Name: </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            onChange={handleChange}
            value={lastName}
          />
        <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            value={email}
          />
        <label htmlFor="phoneNumber">Phone Number: </label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            onChange={handleChange}
            value={phoneNumber}
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={password}
          />
          <label htmlFor="confirm-password">Confirm Password: </label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            onChange={handleChange}
            value={confirmPassword}
          />
          <button>Submit</button>
          {error && <p>{error}</p>}
        </form>
        <Link href="/login">
          <p>Login instead?</p>
        </Link>
        </div>
      </main>
    </div>
  );
}
