import styled from "styled-components";
import React from "react";

const StyledHeading2 = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  background-color: #d4d4d8;
  padding: 12px 16px;
  border-left: 4px solid #71717a;
  border-radius: 0;
`;

interface Heading2Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const Heading2: React.FC<Heading2Props> = ({ children, ...props }) => {
  return <StyledHeading2 {...props}>{children}</StyledHeading2>;
};

export default Heading2;
