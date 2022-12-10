import React from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import { useSelector } from "react-redux";

import Post from "./Post/Post";
import useStyles from "./styles";

const Posts = ({ setCurrentId }) => {
  const posts = useSelector((state) => state.posts);
  const classes = useStyles();

  if (!posts.length) return "No posts";

  return !posts.length ? (
    <CircularProgress />
  ) : (
    <Grid className={classes.conttainer} container align="strech" spacing={3}>
      {posts?.map((post, index) => (
        <Grid key={`${index}_${post.id}`} item xs={12} sm={6}>
          <Post post={post} setCurrentId={setCurrentId} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Posts;
