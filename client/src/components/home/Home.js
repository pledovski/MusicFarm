import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../shared/Spinner";
import { getPosts } from "../../actions/post";
import Grid from "@material-ui/core/Grid";
import PostItem from "../shared/PostItem";
import { useTheme } from "@material-ui/styles";

const Home = ({ getPosts, post: { posts, loading } }) => {
  const theme = useTheme();
  useEffect(() => {
    getPosts();
  }, [getPosts]);
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Grid
        container
        theme={{
          spacing: "8px"
        }}
      >
        <Grid item sm={4} xs={12}>
          <p>Profile...</p>
        </Grid>
        <Grid item sm={8} xs={12}>
          {posts.map(post => (
            <PostItem key={post._id} post={post} />
          ))}
        </Grid>
      </Grid>
    </Fragment>
  );
};

Home.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getPosts }
)(Home);
