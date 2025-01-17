import { Injectable } from '@nestjs/common';
import {
  ActionEntity,
  ActionStatusEnum,
  ActionTypesEnum,
  EventBody,
  EventHeaders,
  IntegrationPayloadEventType,
} from '@tegonhq/types';
import { Response } from 'express';
import { PrismaService } from 'nestjs-prisma';

import { generateKeyForUserId } from 'common/authentication';

import { getIntegrationAccountsFromActions } from 'modules/action-event/action-event.utils';
import {
  TriggerdevService,
  TriggerProjects,
} from 'modules/triggerdev/triggerdev.service';

@Injectable()
export default class WebhookService {
  constructor(
    private triggerDevService: TriggerdevService,
    private prisma: PrismaService,
  ) {}

  async handleEvents(
    response: Response,
    sourceName: string,
    eventHeaders: EventHeaders,
    eventBody: EventBody,
  ) {
    if (sourceName === 'slack') {
      if (eventBody.type === 'url_verification') {
        response.send({ challenge: eventBody.challenge });
        return null;
      }
    }

    response.send({ status: 200 });

    const accountId = await this.triggerDevService.triggerTask(
      TriggerProjects.Common,
      sourceName,
      {
        event: IntegrationPayloadEventType.GET_IDENTIFIER,
        data: { eventBody, eventHeaders },
      },
    );

    const integrationAccount = await this.prisma.integrationAccount.findFirst({
      where: { accountId, deleted: null },
      include: { workspace: true, integrationDefinition: true },
    });

    if (!integrationAccount) {
      return null;
    }

    const workspaceId = integrationAccount.workspaceId;
    const actionEntities = await this.prisma.actionEntity.findMany({
      where: {
        type: ActionTypesEnum.SOURCE_WEBHOOK,
        entity: sourceName,
        action: { workspaceId, status: ActionStatusEnum.ACTIVE },
        deleted: null,
      },
      include: { action: true },
    });

    const uniqueIntegrations = [
      ...new Set(
        actionEntities.flatMap(
          (actionEntity: ActionEntity) => actionEntity.action.integrations,
        ),
      ),
    ];

    const integrationAccountsMap = await getIntegrationAccountsFromActions(
      this.prisma,
      workspaceId,
      uniqueIntegrations,
    );

    integrationAccountsMap[integrationAccount.integrationDefinition.slug] =
      integrationAccount;

    // TODO (actons): Send all integration accounts based on the ask
    actionEntities.map(async (actionEntity: ActionEntity) => {
      const actionUser = await this.prisma.usersOnWorkspaces.findFirst({
        where: {
          workspaceId: actionEntity.action.workspaceId,
          user: { username: actionEntity.action.slug },
        },
      });
      const accessToken = await generateKeyForUserId(actionUser.userId);

      this.triggerDevService.triggerTaskAsync(
        workspaceId,
        actionEntity.action.slug,
        {
          event: ActionTypesEnum.SOURCE_WEBHOOK,
          action: actionEntity.action,
          eventBody,
          eventHeaders,
          accessToken,
          userId: actionUser.id,
          integrationAccounts: integrationAccountsMap,
        },
        { lockToVersion: actionEntity.action.triggerVersion },
      );
    });

    return { status: 200 };
  }
}
