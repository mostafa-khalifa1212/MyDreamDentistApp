// CustomComponents.js
import React from 'react';
import moment from 'moment-timezone';

// Custom Event component for rendering appointments in the calendar
export const CustomEvent = ({ event }) => {
  const { resource } = event;
  
  // Set background color based on appointment color or status
  let backgroundColor = resource.colorCode || '#4287f5';
  let textColor = 'white';
  
  // If appointment is cancelled or no-show, add visual indication
  if (resource.status === 'cancelled' || resource.status === 'no-show') {
    backgroundColor = 'rgba(156, 163, 175, 0.7)'; // Gray with opacity
    textColor = '#1F2937'; // Dark gray text
  }
  
  // Set border color for payment status
  let borderColor;
  switch (resource.payment?.status) {
    case 'paid':
      borderColor = 'rgb(34, 197, 94)'; // Green
      break;
    case 'partial':
      borderColor = 'rgb(234, 179, 8)'; // Yellow
      break;
    default:
      borderColor = 'rgb(239, 68, 68)'; // Red (pending)
      break;
  }
  
  return (
    <div
      className="overflow-hidden h-full rounded-md p-1"
      style={{
        backgroundColor,
        color: textColor,
        borderLeft: `4px solid ${borderColor}`
      }}
    >
      <div className="text-sm font-medium">{resource.patientName}</div>
      <div className="text-xs truncate">{resource.procedure}</div>
      {resource.status !== 'scheduled' && (
        <div className="text-xs mt-1 font-medium uppercase">
          {resource.status}
        </div>
      )}
    </div>
  );
};

// Custom toolbar component for the calendar
export const CustomToolbar = (props) => {
  const { date, onNavigate, view, onView } = props;
  
  const navigate = action => {
    onNavigate(action);
  };
  
  const viewNames = {
    day: 'Day',
    week: 'Week',
    month: 'Month'
  };
  
  // Format the current date based on the view
  const formatDate = () => {
    const momentDate = moment(date);
    
    switch (view) {
      case 'day':
        return momentDate.format('dddd, MMMM D, YYYY');
      case 'week':
        const start = momentDate.startOf('week').format('MMM D');
        const end = momentDate.endOf('week').format('MMM D, YYYY');
        return `${start} - ${end}`;
      case 'month':
        return momentDate.format('MMMM YYYY');
      default:
        return momentDate.format('MMMM D, YYYY');
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 bg-[#FCF7FF] border-b border-[#C5BAC9]">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => navigate('TODAY')}
          className="px-3 py-1 text-sm bg-[#8E7C93] text-white rounded-md hover:bg-[#201A23] transition-colors"
        >
          Today
        </button>
        
        <button
          type="button"
          onClick={() => navigate('PREV')}
          className="p-1 text-[#201A23] hover:bg-[#C5BAC9] rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <span className="text-lg font-medium text-[#201A23]">
          {formatDate()}
        </span>
        
        <button
          type="button"
          onClick={() => navigate('NEXT')}
          className="p-1 text-[#201A23] hover:bg-[#C5BAC9] rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="flex space-x-1">
        {Object.keys(viewNames).map(viewKey => (
          <button
            key={viewKey}
            type="button"
            onClick={() => onView(viewKey)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              view === viewKey
                ? 'bg-[#201A23] text-white'
                : 'bg-[#C5BAC9] text-[#201A23] hover:bg-[#8E7C93] hover:text-white'
            }`}
          >
            {viewNames[viewKey]}
          </button>
        ))}
      </div>
    </div>
  );
};

// Export named components
export default {
  CustomEvent,
  CustomToolbar
};