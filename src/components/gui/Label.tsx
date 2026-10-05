import styled from "styled-components";

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: stretch;
`;

const LabelKey = styled.div`
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  min-width: 140px;
  padding: 12px 16px;
  border-radius: 4px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const LabelValue = styled.div`
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  flex-grow: 2;
  text-align: left;
  padding: 12px 16px;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #cbd5e1;
  word-break: break-all;
`;

const LabelUnit = styled.div`
  font-size: 13px;
  color: #3b82f6;
  font-weight: 600;
  flex-grow: 0;
  min-width: 60px;
  padding: 12px 16px;
  border-radius: 4px;
  text-align: center;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.15);
  border: 1px solid #93c5fd;
`;

export default function Label({
  title,
  value,
  unit,
}: {
  title: string;
  value: string;
  unit?: string;
}) {
  return (
    <LabelContainer>
      <LabelKey>{title}: </LabelKey>
      <LabelValue>{value}</LabelValue>
      {unit && <LabelUnit>{unit}</LabelUnit>}
    </LabelContainer>
  );
}
