import { PlusIcon } from '@heroicons/react/24/outline';

export default function CalendarSlot({ 
  event, 
  isAbsence, 
  selected, 
  dayIdx, 
  hour,
  isMobile = false,
  handleTouchStart,
  handleTouchEnd,
  handleTouchCancel,
  handleSlotMouseDown,
  handleSlotMouseEnter,
  handleSlotMouseUp,
  handleSlotClick
}) {
  if (isMobile) {
    return (
      <div
        className={`flex-1 relative cursor-pointer group min-w-[36px] max-w-[48px] flex items-center justify-center ${selected ? 'bg-primary/20' : 'bg-white'} border-r border-accent last:border-0`}
        data-day={dayIdx}
        data-hour={hour}
        onTouchStart={handleTouchStart(dayIdx, hour)}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onMouseDown={() => handleSlotMouseDown(dayIdx, hour)}
        onMouseEnter={() => handleSlotMouseEnter(dayIdx, hour)}
        onMouseUp={handleSlotMouseUp}
        onClick={() => handleSlotClick(dayIdx, hour)}
        style={{ minHeight: 36, userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        {event ? (
          isAbsence ? (
            <span className="block w-full h-full rounded-lg bg-red-400 text-white text-xs font-bold flex items-center justify-center px-1">
              {event.label}
            </span>
          ) : (
            <span className="block w-full h-full rounded-lg bg-primary text-white text-xs font-semibold flex items-center justify-center px-1">
              {event.label}
            </span>
          )
        ) : (
          <button
            className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center w-full h-full text-primary"
            style={{ transition: 'opacity 0.2s', userSelect: 'none', WebkitUserSelect: 'none' }}
            onClick={e => { e.stopPropagation(); handleSlotClick(dayIdx, hour); }}
            tabIndex={-1}
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      data-day={dayIdx}
      data-hour={hour}
      className={`h-16 relative border-b border-accent cursor-pointer group ${selected ? 'bg-primary/20' : ''}`}
      onMouseDown={() => handleSlotMouseDown(dayIdx, hour)}
      onMouseEnter={() => handleSlotMouseEnter(dayIdx, hour)}
      onMouseUp={handleSlotMouseUp}
      onClick={() => handleSlotClick(dayIdx, hour)}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {event ? (
        isAbsence ? (
          <div className={`absolute inset-1 rounded-lg shadow flex items-center px-2 text-xs font-bold text-white ${"bg-red-400"}`}>
            {event.label}
          </div>
        ) : (
          <div className={`absolute inset-1 rounded-lg shadow flex items-center px-2 text-xs font-semibold text-white ${event.color}`}>
            {event.label}
          </div>
        )
      ) : (
        <div className="absolute inset-1 flex items-center justify-center text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition pointer-events-none select-none">
          + Ajouter tâche
        </div>
      )}
    </div>
  );
}
