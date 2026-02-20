import styled from "styled-components";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  active?: boolean;
  disabled?: boolean;
}

const StyledButton = styled.button<{
  variant: string;
  size: string;
  active?: boolean;
  disabled?: boolean;
}>`
  color: ${({ active }) => (active ? "white" : "black")};
  background-color: rgb(135, 156, 194);
  font-size: 16px;
  font-weight: 600;
  padding: 12px 16px;
  cursor: pointer;

  &:hover {
    background-color: rgb(38, 120, 252);
    color: white;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    border-color: #94a3b8;
    background-color: #94a3b8;
    color: white;
  }
`;

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  active,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      active={active}
      variant={variant}
      size={size}
      disabled={disabled}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
