import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 16px;
  gap: 12px;
  box-sizing: border-box;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.56rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Description = styled.p`
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.875rem;
`;

interface DashContContainerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title?: string;
  description?: string;
}

/**
 * DashContContainer component
 * A reusable container for each page inside Dashboard main content section.
 */
const DashContContainer: React.FC<DashContContainerProps> = ({
  title,
  description,
  children,
  ...props
}) => (
  <Container {...props}>
    {(title || description) && (
      <Header>
        {title && <Title>{title}</Title>}
        {description && <Description>{description}</Description>}
      </Header>
    )}
    {children}
  </Container>
);

export default DashContContainer;
