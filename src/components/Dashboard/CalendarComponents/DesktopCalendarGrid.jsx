import { format } from 'date-fns';
import CalendarSlot from './CalendarSlot';

export default function DesktopCalendarGrid({ 
  days, 
  HOURS, 
  DAYS, 
  events, 
  isSlotSelected,
  handleSlotMouseUp,
  handleSlotMouseDown,
  handleSlotMouseEnter,
  handleSlotClick
}) {
  return (
    <>
      <div className="flex border-b border-secondary bg-white min-w-[350px] md:min-w-[600px] lg:min-w-[800px]">
        <div className="w-12 md:w-14 lg:w-16" />
        {days.map((date, idx) => (
          <div key={idx} className="flex-1 py-3 px-2 text-center font-semibold text-secondary border-l border-secondary">
            {DAYS[idx]}<br />{format(date, 'dd/MM')}
          </div>
        ))}
      </div>
      
      <div className="flex-1 flex overflow-x-auto select-none min-w-[350px] md:min-w-[600px] lg:min-w-[800px]" onMouseUp={handleSlotMouseUp}>
        <div className="w-12 md:w-14 lg:w-16 flex flex-col">
          {HOURS.map((h) => (
            <div key={h} className="h-16 flex items-center justify-center text-xs text-secondary border-b border-accent">
              {h}:00
            </div>
          ))}
        </div>
        
        {days.map((date, dayIdx) => (
          <div key={dayIdx} className="flex-1 flex flex-col border-l border-secondary">
            {HOURS.map((h) => {
              const event = events.find(ev => ev.day === dayIdx && ev.hour === h);
              const selected = isSlotSelected(dayIdx, h);
              const isAbsence = event && ["MALADIE", "CONGE", "RTT", "AUTRE"].includes(event.label);
              
              return (
                <CalendarSlot
                  key={h}
                  event={event}
                  isAbsence={isAbsence}
                  selected={selected}
                  dayIdx={dayIdx}
                  hour={h}
                  isMobile={false}
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
    </>
  );
}
