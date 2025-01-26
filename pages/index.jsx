import Head from "next/head"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from "../public/styles/Home.module.css"
import { withIronSessionSsr } from "iron-session/next"
import sessionOptions from "../config/session"
import useLogout from "../hooks/useLogout"
import Header from "../components/header"

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        const user = req.session.user
        const props = {}
        if (user) {
            props.user = req.session.user
            props.isLoggedIn = true
        } else {
            props.isLoggedIn = false
        }
        return { props }
    },
    sessionOptions
)

export default function Home(props) {
    const router = useRouter()
    const logout = useLogout
    return (
        <div>
            <Head>
                <title>Self-Care POC</title>
            </Head>

            <Header isLoggedIn={props.isLoggedIn} firstName={props?.user?.firstName}/>

            <main>
                <h1>Welcome to the Self-Care app</h1>
            </main>

        </div>
    )
}