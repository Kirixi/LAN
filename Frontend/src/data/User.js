//The code below is taken from Lectorial code archive week 8
//Writen by Shekhar Kalra
import http from "./http-common";

import { deleteAllUserPost } from "./Posts";
const USERS_KEY = "users";
const CURRENT_KEY = "currentUser";
const AUTH_KEY = "authuser";

async function getUsers() {
  const res = await http.get("/users");
  return res.data;
}

//Get user details of a user from their email
function getUser(email) {
  const userData = getUsers();

  for (const user of userData) {
    if (email === user.email) {
      return user;
    }
  }

  return null;
}

//Add a user to localStorage
async function addUser(user) {
  //If there are already users registered, retrieve all users and add the new user onto the user array and store the updated list in localStorage

  const res = await http.post("/users/create", user);

  return res.data;

}

// Check whether an email has already been registered
function verifyEmail(email) {
  if (getUser(email) === null) {
    return false;
  } else {
    return true;
  }
}
//Set the current logged in user in sessionStorage (Referenced from Week 3 Lecture code example 10)
function setCurrentUser(user) {
  sessionStorage.setItem(CURRENT_KEY, JSON.stringify(user));
}

//Get the current logged in user details from session storage (Referenced from Week 3 Lecture code example 10)
function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem(CURRENT_KEY));
}

//Edit email of specific user
function editEmail(currentEmail, newEmail) {
  let user = getCurrentUser();
  user.email = newEmail;
  sessionStorage.setItem(CURRENT_KEY, JSON.stringify(user));
  
}

//Edit name of specific user (same logic as editEmail)
function editName(currentEmail, newName) {
  let user = getCurrentUser();
  user.name = newName;
  sessionStorage.setItem(CURRENT_KEY, JSON.stringify(user));
 
}

//Log out the user by removing from session storage (Referenced from Week 3 Lecture code example 10)
function logout() {
  sessionStorage.removeItem(CURRENT_KEY);
}

//Delete a user
function deleteUser(email) {
  const data = getUsers();
  let updatedData = [];

  //Add all other users into a new array except the deleting user
  for (const user of data) {
    if (user.email !== email) {
      updatedData.push(user);
    }
  }

  deleteAllUserPost(email);

  //Store the new array of users in local storage
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedData));
}

//Store authentication details
function setAuthentication(userInfo, userCode) {
  const authUser = { user: userInfo, code: userCode };
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
}

//Get authentication details
function getAuthentication() {
  return JSON.parse(sessionStorage.getItem(AUTH_KEY));
}

export {
  getUsers,
  addUser,
  getUser,
  verifyEmail,
  setCurrentUser,
  getCurrentUser,
  editEmail,
  editName,
  deleteUser,
  logout,
  setAuthentication,
  getAuthentication,
};
