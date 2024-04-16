import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "../pages/SignUp";
import { createUser, deleteUser } from "../data/repository";
import { BrowserRouter as Router } from "react-router-dom";

const testUser = {
  name: "Test User",
  email: "testUser@email.com",
  password: "Password12#",
};

afterEach(async () => {
  await deleteUser(testUser.email);
});

beforeEach(() => {});

test("Create new user from Sign Up Page", async () => {
  render(
    <Router>
      <SignUp />
    </Router>
  );

  //Simulate user input for Name field
  const nameVal = screen.getByPlaceholderText("Enter your name");
  fireEvent.change(nameVal, { target: { value: testUser.name } });
  expect(nameVal.value).toBe(testUser.name);

  //Simulate user input for Email field
  const emailVal = screen.getByPlaceholderText("Enter your email address");
  fireEvent.change(emailVal, { target: { value: testUser.email } });
  expect(emailVal.value).toBe(testUser.email);

  //Simulate user input for Password field
  const passVal = screen.getByPlaceholderText("Create a password");
  fireEvent.change(passVal, { target: { value: testUser.password } });
  expect(passVal.value).toBe(testUser.password);

  //Simulate user input for Password Confirm field
  const passConfirmVal = screen.getByPlaceholderText("Create a password");
  fireEvent.change(passConfirmVal, { target: { value: testUser.password } });
  expect(passConfirmVal.value).toBe(testUser.password);

  //Create new user in the database and check whether the created user is the expected testUser
  await waitFor(async () => {
    const data = await createUser(testUser);
    expect(data.name).toBe(testUser.name);
    expect(data.email).toBe(testUser.email);
  });
});
