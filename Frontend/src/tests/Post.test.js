import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Forum from "../pages/Forum";
import { verifyUser, createComment } from "../data/repository";
import { BrowserRouter as Router } from "react-router-dom";

const input = {
  comments: "test comment",
  password: "Password12#",
  email: "test@mail.com",
};

const post = {
  content: "Test Post",
  userEmail: "test@mail.com",
  link: "",
};

test("Post test", async () => {
  render(
    <Router>
      <Forum user={verifyUser(input.email, input.password)} />
    </Router>
  );

  //Simulate user input for Email field
  const buttonVal = await screen.findByRole("button", { name: "Create Post" });
  fireEvent.click(buttonVal);
  const subButtonVal = await screen.findByRole("button", {
    name: "Post",
  });
  expect(subButtonVal).toBeTruthy();
});
