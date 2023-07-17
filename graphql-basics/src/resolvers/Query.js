const Query = {
  users: (parent, args, { db }, info) => {
    const { query } = args;
    let result = [...db.users];
    if (query) {
      result = result.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    return result;
  },
  posts: (_, args, { db }) => {
    let result = [...db.posts];
    if (args.query) {
      result = result.filter(
        post =>
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
      );
    }
    return result;
  },
  comments: (parent, args, { db }) => db.comments
};

export default Query;
