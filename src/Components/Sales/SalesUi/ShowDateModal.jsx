import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const ShowDateModal = ({ open, onClose, onSelectDate }) => {
  if (!open) return null;

  const today = new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl p-4 w-[320px] animate-scaleIn">
        <DayPicker
          mode="single"
          selected={undefined}
          onSelect={(date) => date && onSelectDate(date)}
          disabled={{ before: today }}        
          defaultMonth={today}
          className="dashboard-calendar"
        />

        <button
          onClick={onClose}
          className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>

      {/* Custom Styling */}
      <style>{`
        .dashboard-calendar .rdp {
          --rdp-accent-color: #2563eb;
          --rdp-background-color: #2563eb;
          margin: 0;
        }

        .dashboard-calendar .rdp-caption {
          font-weight: 600;
          font-size: 15px;
          padding-bottom: 6px;
        }

        .dashboard-calendar .rdp-head_cell {
          font-size: 11px;
          color: #6b7280;
          font-weight: 500;
        }

        .dashboard-calendar .rdp-day {
          border-radius: 8px;
          font-size: 13px;
        }

        .dashboard-calendar .rdp-day_selected {
          background-color: #2563eb;
          color: white;
        }

        .dashboard-calendar .rdp-day_today {
          font-weight: 600;
          color: #2563eb;
        }

        .dashboard-calendar .rdp-day_disabled {
          color: #d1d5db;
          text-decoration: line-through;
          cursor: wait;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.15s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ShowDateModal;



//   <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className={cn(
//                     'w-full justify-start text-left font-normal',
//                     !followUpDate && 'text-muted-foreground'
//                   )}
//                 >
//                   <Calendar className="mr-2 h-4 w-4" />
//                   {followUpDate ? format(followUpDate, 'PPP') : 'Select a date'}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//               <CalendarComponent
//   mode="single"
//   selected={followUpDate}
//   onSelect={handleDateSelect}
//   disabled={{ before: new Date() }}   // 👈 today se pehle
//   initialFocus
// />
//               </PopoverContent>
//             </Popover>