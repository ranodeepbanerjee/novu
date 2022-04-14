import { Injectable } from '@nestjs/common';
import { ChangeRepository } from '@novu/dal';
import { diff, diffApply } from '../utils';
import { PromoteChangeToEnvironmentCommand } from './promote-change-to-environment/promote-change-to-environment.command';
import { PromoteChangeToEnvironment } from './promote-change-to-environment/promote-change-to-environment.usecase';
import { CreateChangeCommand } from './create-change.command';

@Injectable()
export class CreateChange {
  constructor(
    private changeRepository: ChangeRepository,
    private promoteChangeToEnvironment: PromoteChangeToEnvironment
  ) {}

  async execute(command: CreateChangeCommand) {
    const changes = await this.changeRepository.getEntityChanges(command.type, command.item._id);

    const aggregatedItem = changes.reduce((prev, change) => {
      diffApply(prev, change.change);

      return prev;
    }, {});

    const changePayload = diff(aggregatedItem, command.item);

    const item = await this.changeRepository.create({
      _organizationId: command.organizationId,
      _environmentId: command.environmentId,
      _creatorId: command.userId,
      change: changePayload,
      type: command.type,
      _entityId: command.item._id,
      enabled: true,
    });

    if (item.enabled) {
      await this.promoteChangeToEnvironment.execute(
        PromoteChangeToEnvironmentCommand.create({
          organizationId: command.organizationId,
          environmentId: command.environmentId,
          userId: command.userId,
          itemId: item._id,
          type: command.type,
        })
      );
    }

    return item;
  }
}