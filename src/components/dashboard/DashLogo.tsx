import styled from "styled-components";
import { IconInnerShadowTop } from "@tabler/icons-react";

const Container = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 140px;
  color: inherit;
  text-decoration: none;
`;

const Text = styled.span`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.15em;
`;

export function SidebarLogo() {
  return (
    <Container href="/">
      <IconInnerShadowTop size={32} />
      <Text>GCODE VISUALIZER</Text>
    </Container>
  );
}
