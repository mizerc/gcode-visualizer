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
  padding: 16px;
  background: rgba(248, 250, 252, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.6);
`;

const Grid: React.FC<GridProps> = ({ maxCol = 4, gap = 12, children }) => {
  return (
    <GridWrapper maxCol={maxCol} gap={gap}>
      {children}
    </GridWrapper>
  );
};

export default Grid;
