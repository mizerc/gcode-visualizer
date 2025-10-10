import styled from "styled-components";

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const LabelKey = styled.div`
  color: #000;
  font-size: 16px;
  text-align: left;
  min-width: 80px;
  padding: 10px;
  border-radius: 8px;
  background-color: #eee;
`;

const LabelValue = styled.div`
  font-size: 16px;
  color: #000;
  flex-grow: 2;
  text-align: left;
  padding: 10px;
  border-radius: 8px;
  background-color: #ddd;
`;

const LabelUnit = styled.div`
  font-size: 16px;
  color: #000;
  flex-grow: 1;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  background-color: #ccc;
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
