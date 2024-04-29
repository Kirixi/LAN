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
  try {
    const response = await axios.post(API_HOST + "/api/user/create", user);
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function updateName(username, id) {
  try {
    const response = await axios.put(API_HOST + `/api/user/updateName/${id}`, { username: username });
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function updateEmail(id, newEmail) {
  try {
    const response = await axios.put(API_HOST + `/api/user/updateEmail/${id}`, { newEmail: newEmail });
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function updateStatus(id, content) {
  try {
    const response = await axios.put(API_HOST + `/api/user/updateStatus/${id}`, { content: content });
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function deleteUser(id) {
  const response = await axios.delete(API_HOST + `/api/user/delete/${id}`);
  return response.data;
}

// --- Post ---------------------------------------------------------------------------------------
async function getPosts() {
  try {
    const posts = await axios.get(API_HOST + "/api/post/all");
    return posts.data;
  } catch (e) {
    throw e;
  }
}

async function loadUserPosts(id) {
  const response = await axios.get(API_HOST + `/api/post/userposts/${id}`);
  return response.data;
}

async function createPost(post) {
  try {
    const response = await axios.post(API_HOST + "/api/post/create", post);
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function editPost(id, post) {
  try {
    const response = await axios.put(API_HOST + `/api/post/update/${id}`, post);
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

async function getUserComments(id) {
  try {
    const response = await axios.get(API_HOST + `/api/comment/getUserComments/${id}`);
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function createComment(comment) {
  try {
    const response = await axios.post(API_HOST + "/api/comment/create", comment);
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function updateComment(id, updatedComment) {
  try {
    const response = await axios.put(API_HOST + `/api/comment/update/${id}`, updatedComment);
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function deleteComment(id) {
  try {
    const response = await axios.delete(API_HOST + `/api/comment/delete/${id}`);
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function deletePost(id) {
  const response = await axios.delete(API_HOST + `/api/post/delete/${id}`);
  return response.data;
}

// --- Follow ---------------------------------------------------------------------------------------
async function getUserFollowers(id) {
  try {
    const response = await axios.get(API_HOST + `/api/follows/getFollowers/${id}`);
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function getFollowings(id) {
  try {
    const response = await axios.get(API_HOST + `/api/follows/getFollowing/${id}`);
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function loadUsersWithFollowers(id) {
  try {
    const response = await axios.get(API_HOST + `/api/follows/unfollowAccounts/${id}`);
    const users = response.data.map((user) => {
      return {
        ...user,
        following: false,
        follow_id: "",
      };
    });
    return users;
  } catch (e) {
    throw e;
  }
}

async function isFollowingUser(current_id, follower_id) {
  try {
    const response = await axios.get(API_HOST + "/api/follows/isFollowing", { params: { follower_id: follower_id, user_id: current_id } });
    return response.data;
  } catch (e) {
    throw e;
  }
}

async function createFollow(follow) {
  const response = await axios.post(API_HOST + "/api/follows/create", follow);
  return response.data;
}

async function deleteFollow(id) {
  const response = await axios.delete(API_HOST + `/api/follows/unfollow/${id}`);
  return response.data;
}

// --- Reactions ---------------------------------------------------------------------------------------

async function createReaction(reaction) {
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
  updateStatus,
  deleteUser,
  loadUsersWithFollowers,
  isFollowingUser,
  createFollow,
  deleteFollow,
  getUserFollowers,
  getFollowings,
  createComment,
  getComments,
  updateComment,
  getUserComments,
  editPost,
  deleteComment,
  deletePost,
  loadUserPosts,
  createReaction,
  getPostReactions,
  getCommentReactions,
  getUserReactions,
  deleteReaction,
};
