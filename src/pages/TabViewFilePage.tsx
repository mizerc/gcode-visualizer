import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useApp } from "@/context/AppContext";
import DashContContainer from "@/components/gui/DashContContainer";

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #d4d4d8;
  border-radius: 6px;
  font-size: 14px;
`;

const Viewer = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  background: #fafafa;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
`;

const Line = styled.div<{ $highlight: boolean }>`
  display: flex;
  background: ${({ $highlight }) => ($highlight ? "#fef9c3" : "transparent")};
  &:hover {
    background: #f4f4f5;
  }
`;

const LineNumber = styled.span`
  width: 56px;
  flex-shrink: 0;
  padding: 0 8px;
  text-align: right;
  color: #a1a1aa;
  user-select: none;
  border-right: 1px solid #e4e4e7;
`;

const LineContent = styled.span`
  padding: 0 12px;
  white-space: pre;
`;

const Comment = styled.span`
  color: #16a34a;
`;

const Empty = styled.div`
  padding: 24px;
  color: #71717a;
  text-align: center;
`;

const renderLine = (line: string) => {
  const idx = line.indexOf(";");
  if (idx === -1) return line;
  return (
    <>
      {line.slice(0, idx)}
      <Comment>{line.slice(idx)}</Comment>
    </>
  );
};

const TabViewFilePage: React.FC = () => {
  const { gcodeText } = useApp();
  const [query, setQuery] = useState("");
  const content = gcodeText ?? "";
  const lines = useMemo(() => content.split(/\r?\n/), [content]);
  const q = query.trim().toLowerCase();

  return (
    <DashContContainer
      title="View File"
      description="View the contents of the selected G-code file."
    >
      {/* INSIDE TOOLBAR */}
      <Toolbar>
        <SearchInput
          placeholder="Search G-code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Toolbar>

      {/* FILE CONTENT */}
      <Viewer>
        {content ? (
          lines.map((line, i) => (
            <Line key={i} $highlight={!!q && line.toLowerCase().includes(q)}>
              <LineNumber>{i + 1}</LineNumber>
              <LineContent>{renderLine(line)}</LineContent>
            </Line>
          ))
        ) : (
          <Empty>No file content to display.</Empty>
        )}
      </Viewer>
    </DashContContainer>
  );
};

export default TabViewFilePage;
