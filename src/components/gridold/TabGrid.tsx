import styled from "styled-components";

export const TabGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(8, auto);
  gap: 20px;
  width: 100%;
  border: 1px solid rgb(22, 22, 22);
  padding: 16px;
`;

export const GridCell = styled.div<{
  colStart?: number;
  colEnd?: number;
  rowStart?: number;
  rowEnd?: number;
}>`
  grid-column: ${({ colStart = 1, colEnd }) =>
    colEnd ? `${colStart} / ${colEnd}` : `${colStart} / span 1`};
  grid-row: ${({ rowStart = 1, rowEnd }) =>
    rowEnd ? `${rowStart} / ${rowEnd}` : `${rowStart} / span 1`};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
