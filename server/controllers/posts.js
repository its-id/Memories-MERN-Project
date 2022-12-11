import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

// QUERY -> /posts?page=1 -> page = 1
export const getPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    const total = await PostMessage.countDocuments({}); // count the total number of posts

    const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex); // sort by _id in descending order, limit to 8 posts per page, skip to the starting index of every page});

    return res
      .status(200)
      .json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// PARAMS -> /posts/123 -> id = 123
export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, "i"); // i -> case insensitive. Eg: "Hello" and "hello" will match
    const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(",") } }] }); // $or -> OR operator, $in -> IN operator.
    // $or: [{ title }, { tags: { $in: tags.split(",") } }] -> will match posts with title "searchQuery" or tags "tags"
    //Eg: tags: { $in: ["coding", "tech"] } will match posts with tags "coding" or "tech".

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  // https://www.restapitutorial.com/httpstatuscodes.html
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// /posts/123
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  await PostMessage.findByIdAndDelete(id);

  res.json({ message: "Post deleted Successfully!" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  // req.userId <--- coming from the auth middleware
  if (!req.userId) return res.json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId)); //if user id exists in the likes array

  if (index === -1) {
    // like the post
    post.likes.push(req.userId);
  } else {
    //dislike the post
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

  res.json(updatedPost);
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await PostMessage.findById(id);

  post.comments.push(value);

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
  res.json(updatedPost);
};
