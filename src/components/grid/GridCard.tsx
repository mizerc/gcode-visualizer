import type { ReactNode } from "react";
import styled from "styled-components";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type GridCardProps = {
  $colSpan?: 1 | 2 | 3 | 4;
  title?: ReactNode;
  desc?: ReactNode;
  children?: ReactNode;
} & Omit<React.ComponentProps<typeof Card>, "children" | "title">;

const StyledGridCard = styled(Card)<Pick<GridCardProps, "$colSpan">>`
  min-width: 0;
  grid-column: span 1;
  padding: 1rem;

  @media (min-width: 640px) {
    grid-column: span ${({ $colSpan = 1 }) => Math.min($colSpan, 2)};
  }

  @media (min-width: 1024px) {
    grid-column: span ${({ $colSpan = 1 }) => $colSpan};
  }
`;

export function GridCard({ title, desc, children, ...props }: GridCardProps) {
  const hasHeader = title !== undefined || desc !== undefined;

  return (
    <StyledGridCard {...props}>
      {hasHeader && (
        <CardHeader>
          {title !== undefined && <CardTitle>{title}</CardTitle>}
          {desc !== undefined && (
            <CardDescription className="flex items-center gap-2">
              {desc}
            </CardDescription>
          )}
        </CardHeader>
      )}
      {children}
    </StyledGridCard>
  );
}
