import { v4 as uuid } from "uuid";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email);
    if (emailTaken) {
      throw new Error("Email taken");
    }
    const newUser = { id: uuid(), ...args.data };
    db.users.push(newUser);

    return newUser;
  },
  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find(user => user.id === id);
    if (!user) {
      throw new Error("User not found");
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }
    if (typeof data.email === "string") {
      const emailTaken = users.some(user.email === data.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }

      user.email = data.email;
    }
    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },
  deleteUser(parent, args, { db }) {
    const userIndex = db.users.findIndex(user => user.id === args.id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const [deletedUser] = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter(post => {
      const match = post.author === args.id;
      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id);
      }
      return !match;
    });
    db.comments = db.comments.filter(comment => comment.author === args.id);
    return deletedUser;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) {
      throw new Error("User not found");
    }

    const newPost = { id: uuid(), ...args.data };
    db.posts.push(newPost);
    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: newPost
        }
      });
    }
    return newPost;
  },
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const post = db.posts.find(post => post.id === id);
    if (!post) {
      throw new Error("Post not found");
    }

    const originalPost = { ...post };
    if (typeof data.title === "string") {
      post.title = data.title;
    }
    if (typeof data.body === "string") {
      post.body = data.body;
    }
    if (typeof data.published === "boolean") {
      post.published = data.published;
      if (originalPost.published && !data.published) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post
          }
        });
      }
    } else if (originalPost.published) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post
        }
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }) {
    const postIndex = db.posts.findIndex(post => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    const [deletedPost] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(
      comment => comment.post !== deletedPost.id
    );
    if (deletedPost.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: deletedPost
        }
      });
    }
    return deletedPost;
  },
  createComment(parent, args, { db, pubsub }) {
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) {
      throw new Error("User not found");
    }

    const postExists = db.posts.some(
      post => post.id === args.data.post && post.published
    );
    if (!postExists) {
      throw new Error("Post not found");
    }

    const newComment = { id: uuid(), ...args.data };
    db.comments.push(newComment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: newComment
      }
    });
    return newComment;
  },
  updateComment(parent, { id, data }, { db, pubsub }, info) {
    const comment = db.comments.find(comment => comment.id === id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    });
    return comment;
  },
  deleteComment(parent, args, { db, pubsub }) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment
      }
    });
    return deletedComment;
  }
};

export default Mutation;
