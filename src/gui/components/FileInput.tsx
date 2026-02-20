import React, { useRef, useState } from "react";
import styled from "styled-components";

interface FileInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  disabled?: boolean;
}

const DropArea = styled.label<{ isDragActive: boolean; disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed
    ${({ isDragActive }) => (isDragActive ? "#4f8bff" : "#94a3b8")};
  background: ${({ isDragActive }) => (isDragActive ? "#edf6fb" : "#f6f8fa")};
  padding: 40px 32px;
  border-radius: 10px;
  color: #555;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  transition: border-color 0.2s, background 0.2s;
  font-size: 1.08rem;
  text-align: center;
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileName = styled.div`
  margin-top: 12px;
  font-size: 0.96em;
  color: #3d405b;
  word-break: break-all;
`;

const FileInput: React.FC<FileInputProps> = ({
  onChange,
  accept,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onChange(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    if (disabled) return;
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      setSelectedFile(file);
      onChange(file);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (disabled) return;
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleLabelClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <DropArea
      tabIndex={0}
      isDragActive={isDragActive}
      disabled={disabled}
      htmlFor="file-input"
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleLabelClick}
    >
      <HiddenInput
        ref={inputRef}
        type="file"
        id="file-input"
        accept={accept}
        disabled={disabled}
        onChange={handleFileChange}
      />
      <div>
        <span role="img" aria-label="file" style={{ fontSize: "2em" }}>
          📄
        </span>
      </div>
      <div style={{ marginTop: 8 }}>
        <strong>Click or drag file here to select</strong>
      </div>
      <div style={{ fontSize: "0.97em", color: "#6c757d", marginTop: 4 }}>
        {accept ? `Accepted: ${accept}` : "Any file type"}
      </div>
      {selectedFile && (
        <FileName>
          Selected: <b>{selectedFile.name}</b>
        </FileName>
      )}
    </DropArea>
  );
};

export default FileInput;
