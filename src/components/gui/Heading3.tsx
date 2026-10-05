import styled from "styled-components";
import React from "react";

const StyledHeading3 = styled.h3`
  /* font */
  font-size: 1.5rem;
  color: #4a4e69;
  border: 1px solid #4a4e69;
`;

interface Heading3Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const Heading3: React.FC<Heading3Props> = ({ children, ...props }) => {
  return <StyledHeading3 {...props}>{children}</StyledHeading3>;
};
