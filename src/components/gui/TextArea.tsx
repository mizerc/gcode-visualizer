import styled from "styled-components";

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  min-width: 0;
  min-height: 24rem;
  height: min(72vh, 56rem);
  margin: 0;
  padding: 16px;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 4%);

  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 1.65;
  color: #27272a;
  background: #fafafa;
  white-space: pre;
  overflow: auto;
  resize: vertical;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;

  &:focus {
    outline: none;
    background: white;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgb(59 130 246 / 16%);
  }

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f4f4f5;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #a1a1aa;
    border: 2px solid #f4f4f5;
    border-radius: 8px;

    &:hover {
      background: #71717a;
    }
  }
`;

export default TextArea;
