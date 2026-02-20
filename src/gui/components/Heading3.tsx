import styled from "styled-components";
import React from "react";

const StyledHeading3 = styled.h3`
  font-size: 1.5rem;
  font-weight: 500;
  color: #4a4e69;
  line-height: 1.2;
  background-color: #d4d4d8;
  padding: 12px 16px;
`;

interface Heading3Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const Heading3: React.FC<Heading3Props> = ({ children, ...props }) => {
  return <StyledHeading3 {...props}>{children}</StyledHeading3>;
};

export default Heading3;
