import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { sort } from 'fast-sort';
import { observer } from 'mobx-react-lite';

import type { NotificationType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { NotificationItem } from './notification-item';

export const NotificationsList = observer(() => {
  const { notificationsStore } = useContextStore();
  const notifications = sort(notificationsStore.getNotifications).desc(
    (notification: NotificationType) => new Date(notification.updatedAt),
  ) as NotificationType[];

  return (
    <ScrollArea>
      <div className="flex flex-col pt-2">
        {notifications.map((notification: NotificationType, index: number) => (
          <NotificationItem
            notification={notification}
            key={notification.id}
            nextNotification={notifications[index + 1]}
          />
        ))}
      </div>
    </ScrollArea>
  );
});
