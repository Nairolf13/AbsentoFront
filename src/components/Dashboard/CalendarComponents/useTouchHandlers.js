import { useState, useRef, useEffect } from 'react';

export default function useTouchHandlers(setModalOpen, setModalSlot, setTaskLabel) {
  const [selecting, setSelecting] = useState(false);
  const [rangeStart, setRangeStart] = useState(null); 
  const [rangeEnd, setRangeEnd] = useState(null);

  const touchState = useRef({
    selecting: false,
    start: null,
    end: null,
    dayIdx: null,
    startX: 0,
    startY: 0,
  });

  const longPressTimeout = useRef(null);
  const longPressTriggered = useRef(false);
  const mobileGridRef = useRef(null);

  const handleTouchStart = (dayIdx, hour) => (e) => {
    if (e.touches.length > 1) return;
    longPressTriggered.current = false;
    longPressTimeout.current = setTimeout(() => {
      longPressTriggered.current = true;
      const touch = e.touches[0];
      document.body.style.overflow = 'hidden';
      touchState.current = {
        selecting: true,
        start: { dayIdx, hour },
        end: { dayIdx, hour },
        dayIdx,
        startX: touch.clientX,
        startY: touch.clientY,
      };
      setSelecting(true);
      setRangeStart({ dayIdx, hour });
      setRangeEnd({ dayIdx, hour });
    }, 400);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 1) return;
    if (!longPressTriggered.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
      return;
    }
    const touch = e.touches[0];
    let el = document.elementFromPoint(touch.clientX, touch.clientY);
    while (el && (!el.getAttribute('data-day') || !el.getAttribute('data-hour')) && el.parentElement) {
      el = el.parentElement;
    }
    if (el && el.getAttribute('data-day') && el.getAttribute('data-hour')) {
      const dayIdx = parseInt(el.getAttribute('data-day'));
      const hour = parseInt(el.getAttribute('data-hour'));
      if (touchState.current.selecting && dayIdx === touchState.current.dayIdx) {
        setRangeEnd({ dayIdx, hour });
        touchState.current.end = { dayIdx, hour };
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (e) => {
    clearTimeout(longPressTimeout.current);
    document.body.style.overflow = '';
    if (touchState.current.selecting && touchState.current.start && touchState.current.end) {
      setSelecting(false);
      const { start, end } = touchState.current;
      if (start.hour === end.hour) {
        setModalSlot({ dayIdx: start.dayIdx, hour: start.hour });
      } else {
        setModalSlot({ dayIdx: start.dayIdx, start: Math.min(start.hour, end.hour), end: Math.max(start.hour, end.hour) });
      }
      setTaskLabel("");
      setTimeout(() => setModalOpen(true), 0);
    }
    setSelecting(false);
    setRangeStart(null);
    setRangeEnd(null);
    touchState.current = { selecting: false, start: null, end: null, dayIdx: null, startX: 0, startY: 0 };
  };

  const handleTouchCancel = (e) => {
    clearTimeout(longPressTimeout.current);
    document.body.style.overflow = '';
    setSelecting(false);
    setRangeStart(null);
    setRangeEnd(null);
    touchState.current = { selecting: false, start: null, end: null, dayIdx: null, startX: 0, startY: 0 };
  };

  const handleSlotClick = (dayIdx, hour) => {
    setModalSlot({ dayIdx, hour });
    setTaskLabel("");
    setModalOpen(true);
  };

  const handleSlotMouseDown = (dayIdx, hour) => {
    setSelecting(true);
    setRangeStart({ dayIdx, hour });
    setRangeEnd({ dayIdx, hour });
  };

  const handleSlotMouseEnter = (dayIdx, hour) => {
    if (selecting && rangeStart && dayIdx === rangeStart.dayIdx) {
      setRangeEnd({ dayIdx, hour });
    }
  };

  const handleSlotMouseUp = () => {
    setSelecting(false);
    if (rangeStart && rangeEnd) {
      setModalSlot({ dayIdx: rangeStart.dayIdx, start: Math.min(rangeStart.hour, rangeEnd.hour), end: Math.max(rangeStart.hour, rangeEnd.hour) });
      setTaskLabel("");
      setTimeout(() => setModalOpen(true), 0); 
    } else {
      setModalSlot(null);
      setTaskLabel("");
    }
    setRangeStart(null);
    setRangeEnd(null);
  };

  const isSlotSelected = (dayIdx, hour) => {
    if (!(selecting || touchState.current.selecting) || !(rangeStart || touchState.current.start) || !(rangeEnd || touchState.current.end)) return false;
    const s = selecting ? rangeStart : touchState.current.start;
    const e = selecting ? rangeEnd : touchState.current.end;
    if (!s || !e) return false;
    if (dayIdx !== s.dayIdx) return false;
    const minH = Math.min(s.hour, e.hour);
    const maxH = Math.max(s.hour, e.hour);
    return hour >= minH && hour <= maxH;
  };

  useEffect(() => {
    const grid = mobileGridRef.current;
    if (!grid) return;
    
    const handleMove = (e) => handleTouchMove(e);
    grid.addEventListener('touchmove', handleMove, { passive: false });
    
    return () => grid.removeEventListener('touchmove', handleMove);
  }, []);

  return {
    selecting,
    rangeStart,
    rangeEnd,
    mobileGridRef,
    handleTouchStart,
    handleTouchEnd,
    handleTouchCancel,
    handleSlotClick,
    handleSlotMouseDown,
    handleSlotMouseEnter,
    handleSlotMouseUp,
    isSlotSelected
  };
}
