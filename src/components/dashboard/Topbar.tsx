import styled from "styled-components";
import { PanelLeftIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { useApp } from "@/context/AppContext";
import { Button } from "../guiv2/Button";

const Header = styled.header`
  display: flex;
  height: 72px;
  flex-shrink: 0;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border);
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.25rem;
  padding: 0 1rem;

  @media (min-width: 1024px) {
    gap: 0.5rem;
    padding: 0 1.5rem;
  }
`;

const SidebarToggle = styled.button`
  display: inline-flex;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  margin-left: -0.25rem;
  cursor: pointer;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  color: inherit;

  &:hover {
    background: var(--muted);
  }

  &:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
`;

const VerticalSeparator = styled(Separator)`
  width: 1px;
  height: 1rem;
  flex-shrink: 0;
  margin: 0 0.5rem;
  background-color: var(--border);
`;

const StatusActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`;

const LoadedStatus = styled.p<{ $isLoaded: boolean }>`
  padding: 0.25rem 0.75rem;
  color: ${({ $isLoaded }) => ($isLoaded ? "#16a34a" : "#dc2626")};
`;

export function Topbar() {
  const { isLoaded, clear, gcodeFileName } = useApp();
  const { toggleSidebar } = useSidebar();

  return (
    <Header>
      <Content>
        <SidebarToggle
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <PanelLeftIcon aria-hidden="true" />
        </SidebarToggle>

        <VerticalSeparator orientation="vertical" />

        <StatusActions>
          <LoadedStatus $isLoaded={isLoaded}>
            Current G-code File: {gcodeFileName}
          </LoadedStatus>
          {isLoaded && (
            <Button
              onClick={() => {
                clear();
              }}
            >
              Unload
            </Button>
          )}
        </StatusActions>
      </Content>
    </Header>
  );
}
