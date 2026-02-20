import styled from "styled-components";
import React from "react";

const StyledHeading1 = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5em 0;
  color: #22223b;
  line-height: 1.15;
`;

interface Heading1Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const Heading1: React.FC<Heading1Props> = ({ children, ...props }) => {
  return <StyledHeading1 {...props}>{children}</StyledHeading1>;
};

export default Heading1;
