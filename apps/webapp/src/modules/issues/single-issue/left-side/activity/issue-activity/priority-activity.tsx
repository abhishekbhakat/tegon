import { TimelineItem } from '@tegonhq/ui/components/timeline';
import { cn } from '@tegonhq/ui/lib/utils';
import * as React from 'react';

import { PriorityIcons } from 'modules/issues/components';

import { Priorities, type IssueHistoryType } from 'common/types';

interface PriorityActivityProps {
  issueHistory: IssueHistoryType;
  fullname: string;
  showTime?: boolean;
}
export function PriorityActivity({
  issueHistory,
  fullname,
  showTime = false,
}: PriorityActivityProps) {
  const priorityText = Priorities[issueHistory.toPriority];
  const PriorityIcon = PriorityIcons[issueHistory.toPriority];

  return (
    <TimelineItem
      key={`${issueHistory.id}-removedLabels`}
      hasMore
      date={showTime && issueHistory.updatedAt}
    >
      <div className="flex items-center text-muted-foreground">
        <PriorityIcon.icon
          size={20}
          className={cn(
            'mr-4',
            issueHistory.toPriority === 1 && 'text-[#F9703E]',
          )}
        />

        <div className="flex items-center">
          <span className="text-foreground mr-2 font-medium">{fullname}</span>
          set priority to
          <span className="text-foreground mx-2 font-medium">
            {priorityText}
          </span>
        </div>
      </div>
    </TimelineItem>
  );
}
