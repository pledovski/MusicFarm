import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";

const Container = styled.div`
  border-radius: 5px 5px 0 0;
  margin-top: 10px;
  width: 100%;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  align-items: center;
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
  width: 75px;
  height: 75px;
  border-radius: 5px;
  margin-right: 1rem;
`;

const Info = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  align-items: center;
`;

const MainInfo = styled.div`
  display: grid;
  grid-auto-flow: row;
  align-items: start;
`;

const SecondaryInfo = styled.div`
  display: grid;
  grid-auto-flow: row;
  align-items: start;
`;

const Title = styled.p`
  font-size: 1rem;
`;

const Artist = styled.p`
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
`;

const Description = styled.p`
  font-size: 0.8rem;
  font-weight: 400;
`;

const Actions = styled.button`
  width: 75px;
  height: 75px;
  border-radius: 5px;
`;

const ReleaseListItem = ({
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
          <MainInfo>
            <Title>{title}</Title>
            <Artist>{artist}</Artist>
          </MainInfo>
          <SecondaryInfo>
            <Description>{description}</Description>
            <Description>{style}</Description>
            <Description>{records.length} records</Description>
          </SecondaryInfo>
        </Info>
        <Actions />
      </Container>
    </Link>
  );
};

ReleaseListItem.propTypes = {
  release: PropTypes.object.isRequired
};

export default ReleaseListItem;
