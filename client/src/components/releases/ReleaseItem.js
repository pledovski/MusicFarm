import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";

const Container = styled.div`
  border-radius: 5px 5px 0 0;
  height: 240px;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  color: #27117c;
  box-sizing: border-box;
  background-image: linear-gradient(
    to bottom,
    #ebe6f8,
    #ece5f6,
    #ede4f5,
    #eee4f3,
    #efe3f1
  );
`;

const Cover = styled.img`
  width: 135px;
  height: 135px;
  border-radius: 5px;
  margin-right: 1rem;
`;

const Info = styled.div`
  margin-top: 1rem;
`;

const Title = styled.p`
  font-size: 1rem;
`;

const Artist = styled.p`
  font-weight: 600;
  font-size: 0.8rem;
  /* font-weight: 400; */
  text-transform: uppercase;
  margin-top: 0.5rem;
`;

const Description = styled.p`
  font-size: 0.8rem;
  font-weight: 400;
  margin-top: 0.5rem;
`;

const ReleaseItem = ({
  release: {
    _id,
    artist,
    title,
    label,
    format,
    country,
    style,
    description,
    records
  }
}) => {
  return (
    <Link to={`/releases/${_id}`}>
      <Container>
        <Cover />
        <Info>
          <Title>{title}</Title>
          <Artist>{artist}</Artist>
          <Description>{description}</Description>
          <Description>{style}</Description>
          <Description>{records.length} {" "} records</Description>
        </Info>
      </Container>
    </Link>
  );
};

ReleaseItem.propTypes = {
  release: PropTypes.object.isRequired
};

export default ReleaseItem;
