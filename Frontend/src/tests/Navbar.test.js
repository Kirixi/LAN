import { render, screen } from "@testing-library/react";
import App from "../App";
import Header from "../components/Header";
import { BrowserRouter as Router } from "react-router-dom";
import { verifyUser } from "../data/repository";
const testUser = {
  name: "Test User",
  email: "test@email.com",
  password: "Password12#",
};

test("Navbar render test", async () => {
  render(
    <Router>
      <App />
    </Router>
  );
  const navbar = screen.getByTestId("navbar");
  expect(navbar).toBeTruthy();
});

test("Navbar buttons render test", async () => {
  render(
    <Router>
      <Header user={verifyUser(testUser.email, testUser.password)} />
    </Router>
  );

  const myprofile = await screen.findByRole("button", { name: "My Profile" });
  const forum = await screen.findByRole("button", { name: "Forum" });
  const users = await screen.findByRole("button", { name: "Users" });
  expect(myprofile).toBeTruthy();
  expect(forum).toBeTruthy();
  expect(users).toBeTruthy();
});
