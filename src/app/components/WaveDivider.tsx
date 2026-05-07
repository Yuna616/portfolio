export function WaveDivider() {
  return (
    <div
      className="relative z-20 w-full leading-none -mt-10 sm:-mt-16 md:-mt-20 lg:-mt-28 overflow-visible pointer-events-none"
      aria-hidden
    >
      {/*
        하단이 직선(L … Z)이고 상단이 부드러운 곡선 — 흰색이 아래에서 위로 자연스럽게 이어짐
      */}
      <svg
        className="relative block w-full h-[56px] sm:h-[80px] md:h-[96px] lg:h-[112px] text-white"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0,72 C120,42 280,98 480,58 C680,18 820,108 1020,68 C1180,38 1320,92 1440,52 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
}
