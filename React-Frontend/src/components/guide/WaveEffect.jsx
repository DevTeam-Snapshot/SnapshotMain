function WaveEffect() {
  return (
    <>
      <div className="wave-layer wave-layer--back">
        <svg viewBox="0 0 200 100" preserveAspectRatio="none">
          <path d="M0,35 C50,60 150,10 200,35 L200,100 L0,100 Z" fill="#0d9488" />
        </svg>
        <svg viewBox="0 0 200 100" preserveAspectRatio="none">
          <path d="M0,35 C50,60 150,10 200,35 L200,100 L0,100 Z" fill="#0d9488" />
        </svg>
      </div>
      <div className="wave-layer wave-layer--front">
        <svg viewBox="0 0 200 100" preserveAspectRatio="none">
          <path d="M0,42 C60,15 140,65 200,42 L200,100 L0,100 Z" fill="#5eead4" />
        </svg>
        <svg viewBox="0 0 200 100" preserveAspectRatio="none">
          <path d="M0,42 C60,15 140,65 200,42 L200,100 L0,100 Z" fill="#5eead4" />
        </svg>
      </div>
    </>
  );
}

export default WaveEffect;