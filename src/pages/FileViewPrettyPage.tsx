import React, { useState } from "react";
import styled from "styled-components";
import { useApp } from "@/context/AppContext";
import DashContContainer from "@/components/gui/DashContContainer";
import { PrettyTextView } from "@/components/core/PrettyTextView";

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

export const FileViewPrettyPage: React.FC = () => {
  const { gcodeText } = useApp();
  const [query, setQuery] = useState("");

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

      {/* VIEW GOODE PRETTY */}
      {gcodeText && <PrettyTextView rawText={gcodeText} query={query} />}
    </DashContContainer>
  );
};
