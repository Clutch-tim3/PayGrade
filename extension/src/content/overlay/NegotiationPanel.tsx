import React from 'react';

interface NegotiationPanelProps {
  insight: string;
}

const NegotiationPanel: React.FC<NegotiationPanelProps> = ({ insight }) => {
  return (
    <div className="negotiation-panel">
      <div className="neg-header">💡 Negotiation Insight</div>
      <div className="neg-body">
        {insight}
      </div>
    </div>
  );
};

export default NegotiationPanel;
