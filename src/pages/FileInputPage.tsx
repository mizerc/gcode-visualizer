import { useState } from "react";
import styled from "styled-components";
import DashContContainer from "../components/gui/DashContContainer";
import Button from "../components/gui/Button";
import FileInput from "../components/core/FileInput";
import { useApp } from "../context/AppContext";

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  &::before,
  &::after {
    height: 1px;
    flex: 1;
    background: #e2e8f0;
    content: "";
  }
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: #b91c1c;
  font-size: 0.875rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

export function TabInputPage() {
  const { setGcodeFile } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setErrorMessage(null);
    setGcodeFile(file);
  };

  const readFromExample = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [response] = await Promise.all([
        fetch("/gcode-visualizer/rabbit.gcode"),
        // new Promise((resolve) => window.setTimeout(resolve, 2000)),
      ]);
      if (!response.ok) {
        throw new Error("Failed to fetch the example G-code file.");
      }

      const text = await response.text();
      const exampleFile = new File([text], "rabbit.gcode", {
        type: "text/plain",
      });
      setGcodeFile(exampleFile);
    } catch (error) {
      console.error("Error reading example file:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load the example G-code file.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashContContainer
      title="G-CODE FILE INPUT"
      description="Choose a file from your device or drag it into the area below."
      disableValidation={true}
    >
      {/* LOADING CASE */}
      <Row>
        <Button onClick={readFromExample} disabled={isLoading}>
          Load example
        </Button>
      </Row>

      {/* OR DIVIDER */}
      <Divider>or</Divider>

      {/* LOAD FROM FILE */}
      <Row>
        <FileInput
          onChange={handleFileChange}
          accept=".gcode"
          disabled={isLoading}
        />
      </Row>

      {/* ERRROR */}
      {errorMessage && <ErrorMessage role="alert">{errorMessage}</ErrorMessage>}

      {/* STATUS MESSAGE */}
      <span role="status" aria-live="polite">
        {isLoading ? "Loading example G-code file." : ""}
      </span>
    </DashContContainer>
  );
}
