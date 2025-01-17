import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { BoardColumn, BoardItem } from '@tegonhq/ui/components/board';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { BoardIssueItem } from 'modules/issues/components/issue-board-item';

import { getWorkflowColor } from 'common/status-color';
import type { WorkflowType } from 'common/types';
import type { IssueType } from 'common/types';
import { WORKFLOW_CATEGORY_ICONS } from 'common/workflow-icons';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { useFilterIssues } from '../../../../issues-utils';

interface CategoryBoardItemProps {
  workflow: WorkflowType;
}

export const CategoryBoardList = observer(
  ({ workflow }: CategoryBoardItemProps) => {
    const CategoryIcon =
      WORKFLOW_CATEGORY_ICONS[workflow.name] ??
      WORKFLOW_CATEGORY_ICONS['Backlog'];
    const currentTeam = useCurrentTeam();
    const { issuesStore, applicationStore } = useContextStore();
    const issues = issuesStore.getIssuesForState(
      workflow.id,
      currentTeam.id,
      applicationStore.displaySettings.showSubIssues,
    );
    const computedIssues = useFilterIssues(issues, currentTeam.id);

    if (
      computedIssues.length === 0 &&
      !applicationStore.displaySettings.showEmptyGroups
    ) {
      return null;
    }

    return (
      <BoardColumn key={workflow.id} id={workflow.id}>
        <div className="flex flex-col max-h-[100%]">
          <div className="flex gap-1 items-center mb-2">
            <div
              className="flex items-center w-fit h-8 rounded-2xl px-4 py-2 text-accent-foreground"
              style={{
                backgroundColor: getWorkflowColor(workflow).background,
              }}
            >
              <CategoryIcon size={20} />
              <h3 className="pl-2">{workflow.name}</h3>
            </div>

            <div className="rounded-2xl bg-grayAlpha-100 p-1.5 px-2 font-mono">
              {computedIssues.length}
            </div>
          </div>

          <ScrollArea className="pr-3 mr-2">
            <div className="flex flex-col gap-2 grow pb-10">
              {computedIssues.map((issue: IssueType, index: number) => (
                <BoardItem key={issue.id} id={issue.id}>
                  <Draggable
                    key={issue.id}
                    draggableId={issue.id}
                    index={index}
                  >
                    {(
                      dragProvided: DraggableProvided,
                      dragSnapshot: DraggableStateSnapshot,
                    ) => (
                      <BoardIssueItem
                        issueId={issue.id}
                        isDragging={dragSnapshot.isDragging}
                        provided={dragProvided}
                      />
                    )}
                  </Draggable>
                </BoardItem>
              ))}
            </div>
          </ScrollArea>
        </div>
      </BoardColumn>
    );
  },
);
