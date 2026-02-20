import styled from "styled-components";

// Tab Navigation container
export const TabButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #d4d4d8;
  padding-bottom: 0;
  flex-wrap: wrap;
  flex-shrink: 0;
`;

// (Individual) Tab button (not normally used directly, see TabButton.tsx)
export const Tab = styled.button<{ active?: boolean }>`
  padding: 12px 24px;
  background: ${({ active }) => (active ? "#d4d4d8" : "transparent")};
  border: none;
  border-bottom: 3px solid ${({ active }) => (active ? "#71717a" : "transparent")};
  color: ${({ active }) => (active ? "#52525b" : "#71717a")};
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  bottom: -2px;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:active:not(:disabled) {
    transform: none;
  }
`;

// Tab content area
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