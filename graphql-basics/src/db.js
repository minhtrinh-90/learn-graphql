let users = [
  {
    id: "1",
    name: "Andrew",
    email: "andrew@test.com",
    age: 24
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@test.com",
    age: 29
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@test.com",
    age: null
  }
];
let posts = [
  {
    id: "post1",
    title: "New post",
    body: "Hello post",
    published: false,
    author: "1"
  },
  {
    id: "post2",
    title: "NodeJS",
    body: "Hello post",
    published: false,
    author: "2"
  },
  {
    id: "post3",
    title: "React",
    body: "Use NodeJS environment",
    published: true,
    author: "3"
  },
  {
    id: "post4",
    title: "VueJS",
    body: "Pronounced as view",
    published: true,
    author: "1"
  }
];
let comments = [
  {
    id: "comment1",
    text: "This is a comment",
    post: "post1",
    author: "1"
  },
  {
    id: "comment2",
    text: "Nice post",
    post: "post2",
    author: "2"
  },
  {
    id: "comment3",
    text: "Great course",
    post: "post2",
    author: "3"
  },
  {
    id: "comment4",
    text: "This is a comment",
    post: "post3",
    author: "3"
  }
];

export default { users, posts, comments };
