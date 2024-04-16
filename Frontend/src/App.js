import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Testing from "./pages/testing";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Forum from "./pages/Forum";
import Users from "./pages/Users";
import Authentication from "./pages/Authentication";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Fragment, useState } from "react";
import { getCurrentUser, setCurrentUser, logout } from "./data/User";
import Errorpage from "./pages/Errorpage";

function App() {
  const [user, setUser] = useState(getCurrentUser());
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userAuthenticate, setAuthenticate] = useState();

  const verifyUser = (userInfo) => {
    setAuthenticate(userInfo);
  };

  const loginUser = (user) => {
    setCurrentUser(user);
    setUser(user);
    setLoggedIn(true);
  };

  const logoutUser = () => {
    console.log(user);
    logout();
    setUser(null);
    setLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <Fragment>
      <Header user={user} logout={logoutUser} />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="login"
            element={<Login loginUser={loginUser} verifyUser={verifyUser} />}
          />
          <Route path="signup" element={<SignUp loginUser={loginUser} />} />
          <Route path="users" element={<Users user={user} />} />
          <Route path="testing" element={<Testing />} />
          <Route
            path="profile/:id"
            element={<Profile user={user} logout={logoutUser} />}
          />
          <Route
            path="forum"
            element={<Forum user={user} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="authenticate"
            element={
              <Authentication user={userAuthenticate} loginUser={loginUser} />
            }
          />
          <Route path="*" element={<Errorpage />} />
        </Routes>
      </main>
      <Footer />
    </Fragment>
  );
}

export default App;
