import React from "react";
import styled from "styled-components";

type GridProps = {
  maxCol?: number;
  gap?: number;
  children: React.ReactNode;
};

const GridWrapper = styled.div<{ maxCol: number; gap: number }>`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ maxCol }) => 100 / maxCol}%, 1fr)
  );
  gap: ${({ gap }) => gap}px;
`;

const Grid: React.FC<GridProps> = ({ maxCol = 4, gap = 12, children }) => {
  return (
    <GridWrapper maxCol={maxCol} gap={gap}>
      {children}
    </GridWrapper>
  );
};

export default Grid;
