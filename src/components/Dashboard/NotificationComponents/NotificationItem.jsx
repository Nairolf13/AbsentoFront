import "../binButton.css";

export default function NotificationItem({ notification, onMarkAsRead, onDelete }) {
  const renderContent = () => {
    const content = notification.text || notification.message || "";
    if (!content) return null;
    
    return content.split(/\n|\\n|<br\s*\/?>/gi).map((line, i) => (
      <div key={i}>{line}</div>
    ));
  };

  return (
    <li className={`py-3 flex items-center gap-3 justify-between rounded-xl transition ${!notification.lu ? 'bg-yellow-50' : ''}`}>
      <div className="flex items-center gap-3">
        {!notification.lu && <span className="h-2 w-2 bg-primary rounded-full"></span>}
        <span className={`text-sm ${!notification.lu ? 'font-bold text-secondary' : 'text-gray-700'}`}>
          {renderContent()}
        </span>
      </div>
      
      <div className="flex items-center gap-1 justify-end">
        {!notification.lu && (
          <button
            className="text-xs text-green-600 hover:text-green-800 flex items-center justify-center"
            style={{ width: 28, height: 28, minWidth: 0, minHeight: 0, padding: 0 }}
            onClick={() => onMarkAsRead(notification.id)}
            title="Marquer comme lue"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle">
              <circle cx="10" cy="10" r="9"/>
              <path d="M7 10l2 2 4-4"/>
            </svg>
          </button>
        )}
        
        <button
          className="bin-button"
          onClick={() => onDelete(notification.id)}
          title="Supprimer cette notification"
          style={{marginLeft: 0, marginRight: 0, background: 'none', border: 'none', boxShadow: 'none', color: '#e53e3e'}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 39 7"
            className="bin-top"
          >
            <line strokeWidth="4" stroke="currentColor" y2="5" x2="39" y1="5"></line>
            <line
              strokeWidth="3"
              stroke="currentColor"
              y2="1.5"
              x2="26.0357"
              y1="1.5"
              x1="12"
            ></line>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 33 39"
            className="bin-bottom"
          >
            <mask fill="white" id="path-1-inside-1_8_19">
              <path
                d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
              ></path>
            </mask>
            <path
              mask="url(#path-1-inside-1_8_19)"
              fill="currentColor"
              d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
            ></path>
            <path strokeWidth="4" stroke="currentColor" d="M12 6L12 29"></path>
            <path strokeWidth="4" stroke="currentColor" d="M21 6V29"></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 89 80"
            className="garbage"
          >
            <path
              fill="currentColor"
              d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
            ></path>
          </svg>
        </button>
      </div>
    </li>
  );
}
