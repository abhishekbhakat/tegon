import { buttonVariants } from '@tegonhq/ui/components/button';
import { cn } from '@tegonhq/ui/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { getWorkflowColor } from 'common/status-color';
import type { WorkflowType } from 'common/types';
import type { IssueType } from 'common/types';
import { WORKFLOW_CATEGORY_ICONS } from 'common/workflow-icons';

import { useContextStore } from 'store/global-context-provider';

interface ParentIssueViewProps {
  issue: IssueType;
}

export function ParentIssueView({ issue }: ParentIssueViewProps) {
  const { workspaceSlug } = useParams();
  const { workflowsStore, teamsStore } = useContextStore();
  const team = teamsStore.getTeamWithId(issue.parent.teamId);

  const workflows = workflowsStore.getWorkflowsForTeam(
    issue.parent.teamId,
  ) as WorkflowType[];

  const workflow = workflows.find(
    (wk: WorkflowType) => wk.id === issue.parent.stateId,
  );

  const CategoryIcon = WORKFLOW_CATEGORY_ICONS[workflow.name];

  return (
    <Link
      className={cn(
        'cursor-pointer max-w-[600px] rounded-md flex gap-2 items-center bg-grayAlpha-100',
        buttonVariants({ variant: 'secondary' }),
        'w-fit p-2',
      )}
      href={`/${workspaceSlug}/issue/${team.identifier}-${issue.parent.number}`}
    >
      Sub-issue of
      <CategoryIcon
        size={20}
        className="text-muted-foreground"
        color={getWorkflowColor(workflow).color}
      />
      <div className="text-muted-foreground font-mono">
        {team.identifier}-{issue.parent.number}
      </div>
      <div className="max-w-[300px]">
        <div className="truncate">{issue.parent.title}</div>
      </div>
    </Link>
  );
}
