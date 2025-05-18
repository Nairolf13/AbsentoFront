import Calendar from "react-calendar";
import CalendarHeader from './CalendarHeader';
import EmployeeSelector from './EmployeeSelector';

export default function CalendarSidebar({
  user,
  search,
  setSearch,
  selectedEmployeeId,
  setSelectedEmployeeId,
  filteredEmployees,
  loadingEmployees,
  calendarDate,
  setCalendarDate,
  weekStart,
  weekOffset,
  setWeekOffset
}) {
  return (
    <aside className="w-full lg:w-64 bg-white border-r border-secondary flex flex-col items-center py-6">
      <div className="w-full px-2">
        <EmployeeSelector 
          user={user}
          search={search}
          setSearch={setSearch}
          selectedEmployeeId={selectedEmployeeId}
          setSelectedEmployeeId={setSelectedEmployeeId}
          filteredEmployees={filteredEmployees}
          loadingEmployees={loadingEmployees}
        />
        
        <div className="w-full">
          <Calendar
            locale="fr-FR"
            value={calendarDate}
            onChange={setCalendarDate}
            calendarType="iso8601"
            className="rounded-xl border-none shadow w-full"
            tileClassName={({ date }) => date.toDateString() === calendarDate.toDateString() ? "!bg-primary !text-white rounded-full" : ""}
          />
        </div>
      </div>
      <div className="mt-6 w-full px-4">
        <button 
          className="bg-primary text-secondary rounded-xl px-4 py-2 w-full font-semibold mb-2"
          onClick={() => {
            setCalendarDate(new Date());
            setWeekOffset(0);
          }}
        >
          Aujourd'hui
        </button>
        <CalendarHeader 
          weekStart={weekStart} 
          weekOffset={weekOffset} 
          setWeekOffset={setWeekOffset} 
        />
      </div>
    </aside>
  );
}
