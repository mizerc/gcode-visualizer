import styled from "styled-components";

export const TabHeaderContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #d4d4d8;
  padding-bottom: 0;
  flex-wrap: wrap;
  flex-shrink: 0;
`;

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  border: 1px solid rgb(199, 92, 92);

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #d4d4d8;
    border-radius: 0;
  }

  &::-webkit-scrollbar-thumb {
    background: #71717a;
    border-radius: 0;
  }
`;
