import styled from "styled-components";
import React from "react";

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  active?: boolean;
  disabled?: boolean;
}

const StyledTabButton = styled.button<{
  variant: string;
  size: string;
  active?: boolean;
  disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-bottom: 0px solid transparent;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 12px 16px;

  background-color: rgb(135, 156, 194);
  color: black;

  &:hover {
    background-color: rgb(96, 101, 109);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
    
  ${({ active }) =>
    active &&
    `
      background-color: rgb(75, 141, 239);
    `
  }

  &:active:not(:disabled) {
    background-color: rgb(81, 118, 183);
  }
`;

const TabButton: React.FC<TabButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  active,
  disabled,
  ...props
}) => {
  return (
    <StyledTabButton
      active={active}
      variant={variant}
      size={size}
      disabled={disabled}
      {...props}
    >
      {children}
    </StyledTabButton>
  );
};

export default TabButton;
