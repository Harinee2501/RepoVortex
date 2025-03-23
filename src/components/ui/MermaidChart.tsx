import React from 'react';

// Interface for props to pass the Mermaid chart string
interface MermaidChartProps {
  chart: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart }) => {
  return (
    <div className="my-4 p-4 bg-white rounded shadow-md">
      {/* Use dangerouslySetInnerHTML to inject Mermaid code directly */}
      <div
        className="mermaid"
        dangerouslySetInnerHTML={{ __html: chart }}
      />
    </div>
  );
};

export default MermaidChart;
