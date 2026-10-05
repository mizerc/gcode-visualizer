import React from "react";
import styled from "styled-components";

const Root = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 672px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #52525b;
`;

interface DashSectionProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  title: string;
}

const DashSection: React.FC<DashSectionProps> = ({
  title,
  children,
  ...props
}) => (
  <Root {...props}>
    <Title>{title}</Title>
    {children}
  </Root>
);

export default DashSection;
