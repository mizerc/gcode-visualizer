import styled from "styled-components";

const HistogramContainer = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  padding: 24px;
  border-radius: 4px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const HistogramItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CommandCode = styled.div`
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #3b82f6;
  min-width: 60px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 4px;
  text-align: center;
  border: 1px solid #93c5fd;
`;

const BarContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BarBackground = styled.div`
  flex: 1;
  height: 24px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  border: 1px solid #e2e8f0;
`;

const BarFill = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
  transition: width 0.3s ease;
  border-radius: 2px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2));
  }
`;

const CountLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  min-width: 80px;
  text-align: right;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #94a3b8;
  font-style: italic;
`;

interface HistogramProps {
  data: string[];
}

export default function Histogram({ data }: HistogramProps) {
  if (!data || data.length === 0) {
    return (
      <HistogramContainer>
        <EmptyState>No histogram data available for this layer</EmptyState>
      </HistogramContainer>
    );
  }

  // Parse the histogram data
  const parsedData = data
    .map((line) => {
      // Format: "G1: 1234" or similar
      const match = line.match(/^(\w+):\s*(\d+)$/);
      if (match) {
        return {
          code: match[1],
          count: parseInt(match[2], 10),
        };
      }
      return null;
    })
    .filter((item): item is { code: string; count: number } => item !== null);

  if (parsedData.length === 0) {
    return (
      <HistogramContainer>
        <EmptyState>Unable to parse histogram data</EmptyState>
      </HistogramContainer>
    );
  }

  // Find max count for percentage calculation
  const maxCount = Math.max(...parsedData.map((item) => item.count));

  return (
    <HistogramContainer>
      {parsedData.map((item, index) => {
        const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
        return (
          <HistogramItem key={index}>
            <CommandCode>{item.code}</CommandCode>
            <BarContainer>
              <BarBackground>
                <BarFill percentage={percentage} />
              </BarBackground>
              <CountLabel>{item.count.toLocaleString()}</CountLabel>
            </BarContainer>
          </HistogramItem>
        );
      })}
    </HistogramContainer>
  );
}

