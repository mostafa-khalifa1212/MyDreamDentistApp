import React from 'react';

const CustomEvent = ({ event }) => {
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

export default CustomEvent;