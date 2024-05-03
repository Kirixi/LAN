import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "../pages/Profile";
import {
  createUser,
  deleteUser,
  findUser,
  updateName,
  verifyUser,
} from "../data/repository";
import { BrowserRouter as Router } from "react-router-dom";
import { useParams, MemoryRouter } from "react-router-dom";

const profileUser = {
  name: "Profile User",
  email: "profileUser@email.com",
  password: "Password12#",
};

beforeEach(async () => {
  await createUser(profileUser);
});

afterEach(async () => {
  await deleteUser(profileUser.email);
});

//Unit test was taken from https://stackoverflow.com/questions/58117890/how-to-test-components-using-new-react-router-hooks/58206121#58206121
describe("Testing user profile", () => {
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
    useParams: () => ({
      id: "profileUser@email.com",
    }),
    useRouteMatch: () => ({
      url: "http://localhost:3000/profile/profileUser@email.com",
    }),
  }));
});

test("Edit user details", async () => {
  //Update user name and check if updated name matches with name stored in database
  const newName = profileUser.name + "Edited";
  await updateName(newName, profileUser.email);
  const userName = await findUser(profileUser.email);
  expect(userName.name).toBe(newName);
});
