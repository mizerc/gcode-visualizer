import styled from "styled-components";

import { Card } from "@/components/ui/card";

type GridCardProps = {
  $colSpan?: 1 | 2 | 3 | 4;
};

export const GridCard = styled(Card)<GridCardProps>`
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
