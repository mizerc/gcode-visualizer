import styled from "styled-components";

const TextArea = styled.textarea`
  min-height: 6000px;

  margin: 16px;
  padding: 16px;
  border: 2px solid rgb(10, 10, 10);

  font-family: "Consolas", "Monaco", "Courier New", monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #1e293b;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  overflow-y: auto;
  resize: vertical;

  &:focus {
    outline: none;
    background: white;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 0;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 0;
  }
`;

export default TextArea;
