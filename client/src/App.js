import './App.css';
import Home from './home/Home.js'
import Signup from './profile/Signup.js'
import Login from './profile/Login.js'
import Dashboard from './dashboard/Dashboard.js'
import React from "react"
import { useState } from "react"

// if not login, show login
// if login, show home

function App() {
  const [login, setLogin] = useState(false)
  const [signUp, setSignUp] = useState(false)
  const [dashboard, setDashboard] = useState(false)
  const [auth, setAuth] = useState(false)
  const [username, setUser] = useState()
  const [name, setName] = useState()

  function loginClick() {
    setLogin(true)
    setSignUp(false)
    setDashboard(false)
  }

  function signupClick() {
    setSignUp(true)
    setLogin(false)
    setDashboard(false)
  }

  function homeClick() {
    setSignUp(false)
    setLogin(false)
    setDashboard(false)
  }

  function dashboardClick() {
    console.log("dashboard")
    setDashboard(true)
    setSignUp(false)
    setLogin(false)
  }

  function authorized(u, name) {
    setAuth(true)
    setSignUp(false)
    setLogin(false)
    setDashboard(false)
    setUser(u)
    setName(name)
  }

  function returnPage() {
    if (!login && !signUp && !dashboard && !auth) {
        return <Home loginClick={loginClick} signupClick={signupClick} dashboardClick={dashboardClick}/>
    } else if (signUp) {
        return <Signup homeClick={homeClick} loginClick={loginClick} authorized={authorized}/>
    } else if (login) {
        return <Login homeClick={homeClick} signupClick={signupClick} authorized={authorized}/>
    } else if (dashboard) {
        return <Dashboard name={name} username={username}/>
    } else if (auth) {
        return <Dashboard name={name} username={username}/>
    }
  }

  return (
    <div className="App">
      {returnPage()}
    </div>
  );
}

export default App;
