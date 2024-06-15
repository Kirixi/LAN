import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/Login";
import { verifyUser } from "../data/repository";
import { BrowserRouter as Router } from "react-router-dom";

const testUser = {
  email: "test@mail.com",
  password: "Password12#",
};

test("Login test", async () => {
  render(
    <Router>
      <Login />
    </Router>
  );
  //Simulate user input for Email field
  const emailVal = screen.getByPlaceholderText("Enter your email address");
  fireEvent.change(emailVal, { target: { value: testUser.email } });
  expect(emailVal.value).toBe(testUser.email);

  //Simulate user input for Password field
  const passVal = screen.getByPlaceholderText("Enter your password");
  fireEvent.change(passVal, { target: { value: testUser.password } });
  expect(passVal.value).toBe(testUser.password);

  //Create new user in the database and check whether the created user is the expected testUser
  await waitFor(async () => {
    const data = await verifyUser(testUser.email, testUser.password);
    expect(data.email).toBe(testUser.email);
  });
});
