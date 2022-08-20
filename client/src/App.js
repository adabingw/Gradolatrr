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

  function returnPage() {
    if (!login && !signUp && !dashboard) {
        return <Home loginClick={loginClick} signupClick={signupClick} dashboardClick={dashboardClick}/>
    } else if (signUp) {
        return <Signup homeClick={homeClick} loginClick={loginClick}/>
    } else if (login) {
        return <Login homeClick={homeClick} signupClick={signupClick}/>
    } else if (dashboard) {
        return <Dashboard />
    }
  }

  return (
    <div className="App">
      {returnPage()}
    </div>
  );
}

export default App;
