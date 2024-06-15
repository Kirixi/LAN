import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Forum from "../pages/Forum";
import { verifyUser, createComment } from "../data/repository";
import { BrowserRouter as Router } from "react-router-dom";

const input = {
  comments: "test comment",
  password: "Password12#",
  email: "test@mail.com",
};

const comment = {
  content: "test comment",
  userEmail: "test@mail.com",
  parent_id: 3,
};

test("Comment test", async () => {
  render(
    <Router>
      <Forum user={verifyUser(input.email, input.password)} />
    </Router>
  );

  //Simulate user input for Email field
  const commentVal = await screen.findByTestId("input-1");
  fireEvent.change(commentVal, { target: { value: input.comments } });
  expect(commentVal.value).toBe(input.comments);

  //Create new user in the database and check whether the created user is the expected testUser
  await waitFor(async () => {
    const data = await createComment(comment);
    expect(data.content).toBe(comment.content);
  });
});
