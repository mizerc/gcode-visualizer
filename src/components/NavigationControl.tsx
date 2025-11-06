import styled from "styled-components";

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  padding: 20px;
  border-radius: 4px;
  border: 2px solid #e2e8f0;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const NavLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 80px;
`;

const NavValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  min-width: 120px;
`;

const NavValueLabel = styled.span`
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
`;

const NavValueNumber = styled.span`
  color: #3b82f6;
  font-size: 16px;
  font-weight: 700;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  margin-left: auto;
`;

const NavButton = styled.button`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  min-width: unset;
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  margin: 4px 0;
`;

const KeyboardHint = styled.div`
  font-size: 11px;
  color: #94a3b8;
  text-align: center;
  padding: 8px;
  background: rgba(148, 163, 184, 0.05);
  border-radius: 4px;
  font-style: italic;
  border-top: 1px solid #e2e8f0;
  margin-top: 8px;
`;

const Kbd = styled.kbd`
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 3px;
  padding: 2px 6px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 10px;
  font-weight: 600;
  color: #475569;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin: 0 2px;
`;

interface NavigationControlProps {
  layerCount: number;
  currentLayer: number;
  commandsCount: number;
  currentCommand: number;
  onPrevLayer: () => void;
  onNextLayer: () => void;
  onResetLayer: () => void;
  onPrevCommand: () => void;
  onNextCommand: () => void;
  onResetCommand: () => void;
}

export default function NavigationControl({
  layerCount,
  currentLayer,
  commandsCount,
  currentCommand,
  onPrevLayer,
  onNextLayer,
  onResetLayer,
  onPrevCommand,
  onNextCommand,
  onResetCommand,
}: NavigationControlProps) {
  const layerProgress = layerCount > 0 ? ((currentLayer / (layerCount - 1)) * 100).toFixed(0) : 0;
  const commandProgress = commandsCount > 0 ? ((currentCommand / (commandsCount - 1)) * 100).toFixed(0) : 0;

  return (
    <NavContainer>
      <NavSection>
        <NavLabel>Layer</NavLabel>
        <NavValue>
          <NavValueNumber>{currentLayer}</NavValueNumber>
          <NavValueLabel>/ {layerCount - 1} ({layerProgress}%)</NavValueLabel>
        </NavValue>
        <ButtonGroup>
          <NavButton onClick={onPrevLayer} disabled={currentLayer === 0}>
            ← Prev
          </NavButton>
          <NavButton onClick={onNextLayer} disabled={currentLayer >= layerCount - 1}>
            Next →
          </NavButton>
          <NavButton onClick={onResetLayer}>
            ↺ Reset
          </NavButton>
        </ButtonGroup>
      </NavSection>

      <Divider />

      <NavSection>
        <NavLabel>Command</NavLabel>
        <NavValue>
          <NavValueNumber>{currentCommand}</NavValueNumber>
          <NavValueLabel>/ {commandsCount - 1} ({commandProgress}%)</NavValueLabel>
        </NavValue>
        <ButtonGroup>
          <NavButton onClick={onPrevCommand} disabled={currentCommand === 0}>
            ← Prev
          </NavButton>
          <NavButton onClick={onNextCommand} disabled={currentCommand >= commandsCount - 1}>
            Next →
          </NavButton>
          <NavButton onClick={onResetCommand}>
            ↺ Reset
          </NavButton>
        </ButtonGroup>
      </NavSection>

      <KeyboardHint>
        💡 Tip: Use <Kbd>↑</Kbd> <Kbd>↓</Kbd> for layers, <Kbd>←</Kbd> <Kbd>→</Kbd> for commands
      </KeyboardHint>
    </NavContainer>
  );
}

