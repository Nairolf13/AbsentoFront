import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function CalendarHeader({ weekStart, weekOffset, setWeekOffset, isMobile = false }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <button 
        onClick={() => setWeekOffset(weekOffset - 1)} 
        className={isMobile 
          ? "p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
          : "text-secondary"
        }
      >
        {isMobile ? <ChevronLeftIcon className="w-6 h-6" /> : "←"}
      </button>
      <div className={isMobile 
        ? "font-semibold text-primary text-base text-center flex-1"
        : "font-semibold text-secondary"
      }>
        Semaine du {format(weekStart, 'dd MMM yyyy')}
      </div>
      <button 
        onClick={() => setWeekOffset(weekOffset + 1)} 
        className={isMobile 
          ? "p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
          : "text-secondary"
        }
      >
        {isMobile ? <ChevronRightIcon className="w-6 h-6" /> : "→"}
      </button>
    </div>
  );
}
