'use client';

import { Loader } from '@tegonhq/ui/components/loader';
import * as React from 'react';

import type { BootstrapResponse } from 'common/types';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useBootstrapRecords, useDeltaRecords } from 'services/sync';

import { useContextStore } from 'store/global-context-provider';
import { MODELS } from 'store/models';
import { UserContext } from 'store/user-context';

import { saveSocketData } from './socket-data-util';

interface Props {
  children: React.ReactElement;
}

export function BootstrapWrapper({ children }: Props) {
  const workspace = useCurrentWorkspace();
  const user = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const lastSequenceId = localStorage && localStorage.getItem('lastSequenceId');
  const {
    commentsStore,
    issuesHistoryStore,
    issuesStore,
    workflowsStore,
    workspaceStore,
    teamsStore,
    labelsStore,
    integrationAccountsStore,
    linkedIssuesStore,
    issueRelationsStore,
    notificationsStore,
    viewsStore,
    issueSuggestionsStore,
    actionsStore,
  } = useContextStore();

  const MODEL_STORE_MAP = {
    [MODELS.Label]: labelsStore,
    [MODELS.Workspace]: workspaceStore,
    [MODELS.UsersOnWorkspaces]: workspaceStore,
    [MODELS.Team]: teamsStore,
    [MODELS.Workflow]: workflowsStore,
    [MODELS.Issue]: issuesStore,
    [MODELS.IssueHistory]: issuesHistoryStore,
    [MODELS.IssueComment]: commentsStore,
    [MODELS.IntegrationAccount]: integrationAccountsStore,
    [MODELS.LinkedIssue]: linkedIssuesStore,
    [MODELS.IssueRelation]: issueRelationsStore,
    [MODELS.Notification]: notificationsStore,
    [MODELS.View]: viewsStore,
    [MODELS.IssueSuggestion]: issueSuggestionsStore,
    [MODELS.Action]: actionsStore,
  };

  React.useEffect(() => {
    if (workspace) {
      initStore();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { refetch: bootstrapIssuesRecords } = useBootstrapRecords({
    modelNames: Object.values(MODELS),
    workspaceId: workspace?.id,
    userId: user.id,
    onSuccess: (data: BootstrapResponse) => {
      saveSocketData(data.syncActions, MODEL_STORE_MAP);
      localStorage.setItem('lastSequenceId', `${data.lastSequenceId}`);
    },
  });

  const { refetch: syncIssuesRecords } = useDeltaRecords({
    modelNames: Object.values(MODELS),
    workspaceId: workspace?.id,
    lastSequenceId,
    userId: user.id,
    onSuccess: (data: BootstrapResponse) => {
      saveSocketData(data.syncActions, MODEL_STORE_MAP);
      localStorage.setItem('lastSequenceId', `${data.lastSequenceId}`);
    },
  });

  const initStore = async () => {
    if (lastSequenceId) {
      await syncIssuesRecords();
    } else {
      await bootstrapIssuesRecords();
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
}
