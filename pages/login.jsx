import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
// import styles from "../styles/Account.module.css";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
// import Footer from "../components/footer";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }
    return { props };
  },
  sessionOptions
);

export default function Login(props) {
  const router = useRouter();
  const [{ email, password }, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  function handleChange(e) {
    setForm({ email, password, ...{ [e.target.name]: e.target.value } });
  }
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.firstName} />

      <main>

        <div>
        <h1>
          Login to Self-Care App!
        </h1>
          <form
            onSubmit={handleLogin}
          >
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              value={email}
            />
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              value={password}
            />
            <button>Login</button>
            {error && <p>{error}</p>}
          </form>
          <Link href="/signup">
            <p>Sign up instead?</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
