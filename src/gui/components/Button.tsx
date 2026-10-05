import styled from "styled-components";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  active?: boolean;
}

const StyledButton = styled.button<{
  $variant: NonNullable<ButtonProps["variant"]>;
  $size: NonNullable<ButtonProps["size"]>;
  $active?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  border: 1px solid
    ${({ $variant }) => ($variant === "outline" ? "#cbd5e1" : "transparent")};
  border-radius: 8px;
  background: ${({ $variant, $active }) =>
    $variant === "primary"
      ? $active
        ? "#1d4ed8"
        : "#2563eb"
      : $variant === "secondary"
        ? "#e2e8f0"
        : "transparent"};
  color: ${({ $variant }) => ($variant === "secondary" ? "#1e293b" : "#fff")};
  font: inherit;
  font-size: ${({ $size }) =>
    $size === "small" ? "0.875rem" : $size === "large" ? "1.0625rem" : "1rem"};
  font-weight: 600;
  padding: ${({ $size }) =>
    $size === "small"
      ? "8px 12px"
      : $size === "large"
        ? "14px 20px"
        : "11px 16px"};
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;

  &:hover:not(:disabled) {
    background: ${({ $variant }) =>
      $variant === "primary"
        ? "#1d4ed8"
        : $variant === "secondary"
          ? "#cbd5e1"
          : "#f1f5f9"};
    border-color: ${({ $variant }) =>
      $variant === "outline" ? "#94a3b8" : "transparent"};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid #93c5fd;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  active,
  ...props
}) => (
  <StyledButton
    $active={active}
    $variant={variant}
    $size={size}
    {...props}
  >
    {children}
  </StyledButton>
);

export default Button;
