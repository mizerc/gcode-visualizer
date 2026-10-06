import React from "react";
import styled from "styled-components";
import { LoaderCircle } from "lucide-react";

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

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  min-height: 0;
`;

interface DashContContainerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title?: string;
  description?: string;
  isLoading?: boolean;
}

const Spinner = styled(LoaderCircle)`
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * DashContContainer component
 * A reusable container for each page inside Dashboard main content section.
 */
const DashContContainer: React.FC<DashContContainerProps> = ({
  title,
  description,
  children,
  isLoading,
  ...props
}) => {
  if (isLoading) {
    <Container {...props}>
      <Content>
        <Spinner></Spinner>
      </Content>
    </Container>;
  }
  return (
    <Container {...props}>
      {/* HEADER */}
      {(title || description) && (
        <Header>
          {title && <Title>{title}</Title>}
          {description && <Description>{description}</Description>}
        </Header>
      )}

      {/* CONTENT */}
      <Content>{children}</Content>
    </Container>
  );
};

export default DashContContainer;
