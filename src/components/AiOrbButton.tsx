interface AiOrbButtonProps {
  onClick: () => void;
  hidden?: boolean;
}

export function AiOrbButton({ onClick, hidden = false }: AiOrbButtonProps) {
  if (hidden) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Rising Giants AI assistant"
      title="Ask Rising Giants"
      className="rg-ai-fab"
    >
      <span className="rg-ai-orb" aria-hidden="true">
        <span className="rg-ai-ridge ridge-one" />
        <span className="rg-ai-ridge ridge-two" />
        <span className="rg-ai-ridge ridge-three" />
        <span className="rg-ai-ridge ridge-four" />
        <span className="rg-ai-orb-shine" />
      </span>
      <span className="rg-ai-fab-tooltip">Ask Rising Giants</span>
    </button>
  );
}
