import React, { useState } from "react";
import { FileText, Upload } from "lucide-react";
import styled from "styled-components";

interface FileInputProps {
  onChange: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
}

const DropArea = styled.label<{ $isDragActive: boolean; $disabled?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 190px;
  padding: 28px 24px;
  border: 1.5px dashed
    ${({ $isDragActive }) => ($isDragActive ? "#2563eb" : "#cbd5e1")};
  border-radius: 12px;
  background: ${({ $isDragActive }) => ($isDragActive ? "#eff6ff" : "#f8fafc")};
  color: #334155;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.65 : 1)};
  text-align: center;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover,
  &:focus-within {
    border-color: ${({ $disabled }) => ($disabled ? "#cbd5e1" : "#2563eb")};
    background: ${({ $disabled }) => ($disabled ? "#f8fafc" : "#eff6ff")};
  }

  &:focus-within {
    box-shadow: 0 0 0 3px rgb(37 99 235 / 15%);
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
`;

const UploadIcon = styled.span<{ $isDragActive: boolean }>`
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 12px;
  background: ${({ $isDragActive }) => ($isDragActive ? "#dbeafe" : "#e2e8f0")};
  color: #2563eb;
  transition: background-color 0.18s ease;
`;

const Prompt = styled.strong`
  color: #0f172a;
  font-size: 1rem;
`;

const HelperText = styled.span`
  color: #64748b;
  font-size: 0.875rem;
`;

const FileName = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  margin-top: 4px;
  padding: 7px 10px;
  overflow: hidden;
  border-radius: 6px;
  background: #e2e8f0;
  color: #334155;
  font-size: 0.875rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileInput: React.FC<FileInputProps> = ({
  onChange,
  accept,
  disabled,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const selectFile = (file: File | null) => {
    setSelectedFile(file);
    onChange(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0] ?? null);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (disabled) return;
    selectFile(event.dataTransfer.files[0] ?? null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (!disabled) setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  return (
    <DropArea
      $isDragActive={isDragActive}
      $disabled={disabled}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <HiddenInput
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleFileChange}
      />
      <UploadIcon $isDragActive={isDragActive} aria-hidden="true">
        <Upload size={22} />
      </UploadIcon>
      <Prompt>Drop your G-code file here</Prompt>
      <HelperText>
        or click to browse{accept ? ` · ${accept} files` : ""}
      </HelperText>
      {selectedFile && (
        <FileName title={selectedFile.name}>
          <FileText size={16} aria-hidden="true" />
          {selectedFile.name}
        </FileName>
      )}
    </DropArea>
  );
};

export default FileInput;
