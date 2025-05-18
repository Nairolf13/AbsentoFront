import { format } from 'date-fns';
import CalendarSlot from './CalendarSlot';

export default function MobileCalendarGrid({ 
  mobileGridRef, 
  days, 
  HOURS, 
  DAYS, 
  events, 
  isSlotSelected,
  handleTouchStart,
  handleTouchEnd,
  handleTouchCancel,
  handleSlotMouseDown,
  handleSlotMouseEnter,
  handleSlotMouseUp,
  handleSlotClick
}) {
  return (
    <>
      <div className="flex w-full border-b border-accent mb-2">
        {days.map((date, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center py-1 px-0">
            <span className="text-xs font-bold text-secondary">{DAYS[idx]}</span>
            <span className="text-xs text-primary">{format(date, 'dd/MM')}</span>
          </div>
        ))}
      </div>
      
      <div className="overflow-x-auto" ref={mobileGridRef}>
        <div className="flex flex-col">
          {HOURS.map((h) => (
            <div key={h} className="flex border-b border-accent last:border-0 min-h-[36px]">
              <div className="w-11 flex items-center justify-center text-xs text-secondary bg-accent/70 font-semibold border-r border-accent">
                {h}:00
              </div>
              {days.map((date, dayIdx) => {
                const event = events.find(ev => ev.day === dayIdx && ev.hour === h);
                const selected = isSlotSelected(dayIdx, h);
                const isAbsence = event && ["MALADIE", "CONGE", "RTT", "AUTRE"].includes(event.label);
                
                return (
                  <CalendarSlot
                    key={dayIdx}
                    event={event}
                    isAbsence={isAbsence}
                    selected={selected}
                    dayIdx={dayIdx}
                    hour={h}
                    isMobile={true}
                    handleTouchStart={handleTouchStart}
                    handleTouchEnd={handleTouchEnd}
                    handleTouchCancel={handleTouchCancel}
                    handleSlotMouseDown={handleSlotMouseDown}
                    handleSlotMouseEnter={handleSlotMouseEnter}
                    handleSlotMouseUp={handleSlotMouseUp}
                    handleSlotClick={handleSlotClick}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
