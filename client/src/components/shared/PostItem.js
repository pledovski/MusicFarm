import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

// MUI stuff
import { Typography, CardMedia, CardContent, Card } from "@material-ui/core";

const useStyles = makeStyles({
  card: {
    display: "flex",
    marginBottom: 20
  },
  image: {
    minWidth: 140,
    objectFit: 'cover'
  },
  content: {
    padding: 25
  },
  name: {
    paddingBottom: 10
  }
});

const PostItem = ({
  post: { _id, avatar, date, text, name, likes, comments }
}) => {
  dayjs.extend(relativeTime);
  const classes = useStyles();
  return (
    <Fragment>
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          alt="avatar"
          image={avatar}
          title="avatar"
        />
        <CardContent className={classes.content}>
          <Typography className={classes.name} variant="h5">{name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {dayjs(date).fromNow()}
          </Typography>
          <Typography variant="body1">{text}</Typography>
        </CardContent>
      </Card>
    </Fragment>
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired
};

export default connect()(PostItem);

// export default makeStyles(useStyles)(PostItem);
