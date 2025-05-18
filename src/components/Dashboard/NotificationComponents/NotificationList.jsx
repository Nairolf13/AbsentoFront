import NotificationItem from "./NotificationItem";


export default function NotificationList({ notifications, onMarkAsRead, onDelete }) {
  if (notifications.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Aucune notification
      </div>
    );
  }

  return (
    <ul className="divide-y divide-accent">
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id || index}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
