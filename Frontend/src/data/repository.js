import axios from "axios";
// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:8000";

// --- User ---------------------------------------------------------------------------------------
async function verifyUser(userObj) {
  try {
    const response = await axios.post(API_HOST + "/api/user/login", userObj);
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function verifyEmail(email) {
  try {
    const response = await axios.get(API_HOST + `/api/user/verifyEmail/${email}`);
    return response;
  } catch (e) {
    return false;
  }
}

async function findUser(id) {
  try {
    const response = await axios.get(API_HOST + `/api/user/select/${id}`);
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function createUser(user) {
  const response = await axios.post(API_HOST + "/api/user/create", user);
  return response.data;
}

async function updateName(name, email) {
  const response = await axios.put(API_HOST + `/api/user/updatename/${email}`, { name: name });

  return response.data;
}

async function updateEmail(email, newEmail) {
  const response = await axios.put(API_HOST + `/api/user/updateEmail/${email}`, { newEmail: newEmail });

  return response.data;
}

async function deleteUser(email) {
  const response = await axios.delete(API_HOST + `/api/user/delete/${email}`);

  return response.data;
}

// --- Post ---------------------------------------------------------------------------------------
async function getPosts() {
  const posts = await axios.get(API_HOST + "/api/post/all");
  const users = await axios.get(API_HOST + "/api/user/all");
  console.log(users);

  for (let i = 0; i < posts.data.length; i++) {
    for (let j = 0; j < users.data.length; j++) {
      if (users.data[j]._id === posts.data[i].parent_id) {
        posts.data[i].name = users.data[j].username;
      }
    }
  }

  console.log(posts.data);
  return posts.data;
}

async function loadUserPosts(user) {
  const posts = await getPosts();

  let userPosts = [];

  for (const post of posts) {
    if (post.userEmail === user) {
      userPosts.push(post);
    }
  }
  // console.log(userPosts);
  return userPosts;
}

async function createPost(post) {
  try {
    const response = await axios.post(API_HOST + "/api/post/create", post);
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function getComments() {
  const comments = await axios.get(API_HOST + "/api/post/getComments");
  const users = await axios.get(API_HOST + "/api/users");

  for (let i = 0; i < comments.data.length; i++) {
    for (let j = 0; j < users.data.length; j++) {
      if (users.data[j].email === comments.data[i].userEmail) {
        comments.data[i].name = users.data[j].name;
      }
    }
  }
  return comments.data;
}

async function createComment(comment) {
  const response = await axios.post(API_HOST + "/api/post/createCom", comment);
  return response.data;
}
async function deletePost(id) {
  const response = await axios.delete(API_HOST + `/api/post/delete/${id}`);
  return response.data;
}

// --- Follow ---------------------------------------------------------------------------------------
async function getUserFollows(user) {
  const response = await axios.get(API_HOST + `/api/follows/getUser/${user}`);
  return response.data;
}

async function getFollowings(user) {
  const follows = await getUserFollows(user);
  const users = await axios.get(API_HOST + "/api/users");
  let following = [];

  for (const follow of follows) {
    for (const user of users.data) {
      if (user.email === follow.follower_email) {
        let u = {
          email: user.email,
          name: user.name,
          following: true,
          follow_id: follow.id,
        };
        following.push(u);
      }
    }
  }
  return following;
}

async function loadUsersWithFollowers(user) {
  const users = await axios.get(API_HOST + "/api/users");
  const followers = await getUserFollows(user);
  let following = [];
  for (const user of users.data) {
    let u = {
      email: user.email,
      name: user.name,
      following: false,
      follow_id: null,
    };
    for (const follow of followers) {
      if (follow.follower_email === user.email) {
        u.following = true;
        u.follow_id = follow.id;
        break;
      }
    }
    following.push(u);
  }

  return following;
}

async function isFollowing(user_email, follower_email) {
  let data = null;
  await axios
    .get("http://localhost:4000/api/follows/isfollowing", {
      params: { user_email: "test@mail.com", follower_email: "asd@asd.com" },
    })
    .then((response) => {
      data = response.data;
    });

  return data;
}

async function createFollow(follow) {
  const response = await axios.post(API_HOST + "/api/follows/follow", follow);
  return response.data;
}

async function deleteFollow(id) {
  const response = await axios.delete(API_HOST + `/api/follows/unfollow/${id}`);
  return response.data;
}

async function editPost(id, post) {
  let response = null;
  if (post.link === "") {
    response = await axios.put(API_HOST + `/api/posts/updateContent/${id}`, post);
  } else {
    response = await axios.put(API_HOST + `/api/posts/update/${id}`, post);
  }

  return response.data;
}

// --- Reactions ---------------------------------------------------------------------------------------

async function createReaction(reaction) {
  console.log(reaction);
  const response = await axios.post(API_HOST + "/api/reactions/reaction", reaction);
  return response.data;
}

async function getUserReactions(user) {
  const response = await axios.get(API_HOST + `/api/reactions/getReacts/${user}`);
  return response.data;
}

async function deleteReaction(id) {
  const response = await axios.delete(API_HOST + `/api/reactions/delete/${id}`);
  return response.data;
}

async function getAllReactions() {
  const reactions = await axios.get(API_HOST + "/api/reactions");
  return reactions.data;
}

async function getCommentReactions() {
  const posts = await getComments();
  const reactions = await getAllReactions();
  let forms = [];

  for (const post of posts) {
    let p = {
      content: post.content,
      createdAt: post.createdAt,
      link: post.link,
      name: post.name,
      parent_id: post.parent_id,
      post_id: post.post_id,
      updatedAt: post.updatedAt,
      userEmail: post.userEmail,
      counter: [],
    };
    for (const reaction of reactions) {
      if (post.post_id === reaction.post_id) {
        const user = reaction.user_email;
        p.counter.push({ emoji: reaction.reaction, by: user });
      }
    }

    forms.push(p);
  }

  return forms;
}

async function getPostReactions() {
  const posts = await getPosts();
  const reactions = await getAllReactions();
  let forms = [];

  for (const post of posts) {
    let p = {
      content: post.content,
      createdAt: post.createdAt,
      link: post.link,
      name: post.name,
      parent_id: post.parent_id,
      post_id: post.post_id,
      updatedAt: post.updatedAt,
      userEmail: post.userEmail,
      counter: [],
    };
    for (const reaction of reactions) {
      if (post.post_id === reaction.post_id) {
        const user = reaction.user_email;
        p.counter.push({ emoji: reaction.reaction, by: user });
      }
    }
    forms.push(p);
  }

  return forms;
}

export {
  verifyUser,
  verifyEmail,
  findUser,
  createUser,
  getPosts,
  createPost,
  updateName,
  updateEmail,
  deleteUser,
  loadUsersWithFollowers,
  isFollowing,
  createFollow,
  deleteFollow,
  getFollowings,
  createComment,
  getComments,
  editPost,
  deletePost,
  loadUserPosts,
  createReaction,
  getPostReactions,
  getCommentReactions,
  getUserReactions,
  deleteReaction,
};
