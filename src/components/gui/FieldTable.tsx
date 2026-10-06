import React from "react";
import styled from "styled-components";

const Table = styled.dl`
  display: grid;
  grid-template-columns: max-content 1fr;
  margin: 0;
  font-size: 14px;
  border: 1px solid #a1a1aa;
`;

const Label = styled.dt`
  padding: 8px 16px;
  text-align: right;
  font-weight: 500;
  color: #3f3f46;
  background: #f4f4f5;
  border-bottom: 1px solid #d4d4d8;
  border-right: 1px solid #a1a1aa;

  &:nth-last-of-type(1) {
    border-bottom: none;
  }
`;

const Value = styled.dd`
  margin: 0;
  padding: 8px 16px;
  text-align: left;
  font-weight: 600;
  color: #18181b;
  word-break: break-all;
  border-bottom: 1px solid #d4d4d8;

  &:last-of-type {
    border-bottom: none;
  }
`;

export interface FieldRow {
  label: string;
  value: React.ReactNode;
  unit?: string;
}

interface FieldTableProps extends React.HTMLAttributes<HTMLDListElement> {
  rows: FieldRow[];
}

const FieldTable: React.FC<FieldTableProps> = ({ rows, ...props }) => (
  <Table {...props}>
    {rows.map(({ label, value }) => (
      <React.Fragment key={label}>
        <Label>{label}</Label>
        <Value>{value}</Value>
      </React.Fragment>
    ))}
  </Table>
);

export default FieldTable;
