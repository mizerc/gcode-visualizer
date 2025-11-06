import styled from "styled-components";

const TextArea = styled.textarea`
  min-height: 500px;
  max-height: 600px;
  width: 100%;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  padding: 16px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #1e293b;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  overflow-y: auto;
  resize: vertical;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 
      inset 0 2px 4px rgba(0, 0, 0, 0.05),
      0 0 0 3px rgba(59, 130, 246, 0.1);
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