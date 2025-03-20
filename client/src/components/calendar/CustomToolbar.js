import React from 'react';
import moment from 'moment-timezone';

const CustomToolbar = (props) => {
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
    <div className="flex flex-col md:flex-row items-center justify-between p-3 bg-[#FCF7FF] border-b border-[#C5BAC9]">
      <div className="flex items-center space-x-2 mb-2 md:mb-0">
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
        
        <span className="text-[#201A23] font-medium">
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
        {Object.keys(viewNames).map(key => (
          <button
            key={key}
            type="button"
            onClick={() => onView(key)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              view === key
                ? 'bg-[#201A23] text-white'
                : 'bg-[#C5BAC9] text-[#201A23] hover:bg-[#8E7C93] hover:text-white'
            }`}
          >
            {viewNames[key]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomToolbar;