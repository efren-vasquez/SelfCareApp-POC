import Head from "next/head"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from "../public/styles/Home.module.css"
import { withIronSessionSsr } from "iron-session/next"
import sessionOptions from "../config/session"
import useLogout from "../hooks/useLogout"
import Header from "../components/header"
import DatePicker from "react-datepicker"
import { useState, useEffect } from "react"
import "react-datepicker/dist/react-datepicker.css";

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({req}) {
        const user = req.session.user
        const props = {}
        if (user) {
            props.user = req.session.user
            props.isLoggedIn = true
            props.tasks = props.user.tasks
        } else {
            props.isLoggedIn = false
        }
        console.log("Tasks: ", props.tasks)
        return { props }
    },
    sessionOptions
)

export default function Home(props) {
    const router = useRouter()
    const logout = useLogout()

    const [form, setForm] = useState({
        content: "",
        date: null,
      });
    const [error, setError] = useState("");
    const [tasks, setTasks] = useState(props.tasks || [])

    useEffect(() => {
        async function fetchTasks() {
            try {
                const res = await fetch("/api/tasks/getAllTasks", {
                    method: "GET",
                    headers: {
                      "content-type": "application/json",
                    }
                  });
                if (res.status === 200) {
                    const data = await res.json()
                    setTasks(data.tasks)
                    console.log(tasks)
                }
            } catch (err) {
                console.log('error fetching tasks: ', err.message)
            }
        }
        if (props.isLoggedIn) {
            fetchTasks()
        }
    }, [props.isLoggedIn])

    function handleChange(e) {
        if (e.target.name === 'content') {
            setForm((prev) => ({...prev, content: e.target.value}));
        }
      }

      function handleDateChange(date) {
        setForm(prev => ({...prev, date: date}))
      }
      async function handleCreateTask(e) {
        e.preventDefault();
        const {content, date} = form

        if (!(content && date)) return setError("Must include task and date & time");
    
        try {
          const res = await fetch("/api/tasks/add", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ content, date: date.toISOString() }),
          });
          if (res.ok) {
              const task = await res.json()
              setTasks([...tasks, task])
              setForm({content: "", date: null})
          } else {
              const { error: message } = await res.json();
              setError(message);
          }
        } catch (err) {
          console.log(err);
        }
      }
    async function markTaskComplete(taskId) {
        try {
            const res = await fetch(`/api/tasks/markComplete?taskId=${taskId}`, {
                method: 'PATCH',
                headers: {
                    "content-type": "application/json",
                }
            })
            const tasks = await res.json()
            if (res.ok) {
                setTasks(tasks.map(task =>
                    task._id === taskId ? {...task, markedComplete: true} : task
                ))
                console.log("complete")
            }
        } catch (err) {
            console.log('Error marking task as complete: ', err.message)
        }
    }

    return (
        <div>
            <Head>
                <title>Self-Care POC</title>
            </Head>

            <Header isLoggedIn={props.isLoggedIn} firstName={props?.user?.firstName}/>
            <>
            <main>
                <h1>Welcome to the Self-Care app</h1>
                {props.isLoggedIn ? (
                    <>
                    <form
                    onSubmit={handleCreateTask}>
                    <label htmlFor="content">Task: </label>
                    <input
                      type="type"
                      name="content"
                      id="content"
                      onChange={handleChange}
                      value={form.content}
                    />
                    <label htmlFor="date">Complete By: </label>
                    <DatePicker
                        showIcon
                        selected={form.date}
                        onChange={handleDateChange}
                        dateFormat='MM-dd-yyyy'
                        showTimeSelect
                        isClearable
                        timeFormat='HH:mm'
                        timeIntervals={15}
                    />
                    <button>Add Task</button>
                    {error && <p>{error}</p>}
                  </form>
                  <section>
                    <h2>{props.user.firstName}&apos;s Tasks</h2>
                    {tasks.length > 0 ? (
                        <ul style={{listStyle: "none"}}>
                            {tasks
                            .map((task, i) => (
                                <li key={i}>
                                    <input 
                                        type="checkbox"
                                        onClick={() => {
                                            console.log("task id being passed: ", task._id)
                                            markTaskComplete(task._id)}}
                                    />
                                    <p>Task: {task.content}</p>
                                    <p>Complete By: {new Date(task.date).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No Tasks yet. Add your first!</p>
                    )}
                  </section>
                    </>
                ) : (
                    <section>
                        <Link href={`/signup`}>Signup</Link>
                        <Link href={`/login`}>Login</Link>
                    </section>
                )}
            </main>
            </>
        </div>
    )
}