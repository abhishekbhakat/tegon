/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useMutation } from 'react-query';

import { ajaxPost } from 'common/lib/ajax';
import type { IssueCommentType } from 'common/types/issue';

export interface CreateIssueCommentParams {
  body: string;
  issueId: string;
  parentId?: string;
}

export function createIssueComment({
  issueId,
  body,
  parentId,
}: CreateIssueCommentParams) {
  return ajaxPost({
    url: `/api/v1/issue-comments?issueId=${issueId}`,
    data: { body, parentId },
  });
}

export interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: IssueCommentType) => void;
  onError?: (error: string) => void;
}

export function useCreateIssueCommentMutation({
  onMutate,
  onSuccess,
  onError,
}: MutationParams) {
  const onMutationTriggered = () => {
    onMutate && onMutate();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMutationError = (errorResponse: any) => {
    const errorText = errorResponse?.errors?.message || 'Error occured';

    onError && onError(errorText);
  };

  const onMutationSuccess = (data: IssueCommentType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(createIssueComment, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
