
import React, { useState, useEffect } from 'react';

interface TimerProps {
  startTime: number | undefined;
}

export const Timer: React.FC<TimerProps> = ({ startTime }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - startTime) / 1000);
      setElapsed(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60);
    const ss = seconds % 60;
    return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded border border-navarra-gold/20 text-navarra-gold font-mono text-sm font-bold shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
      <span>⏱</span>
      <span>{formatTime(elapsed)}</span>
    </div>
  );
};
