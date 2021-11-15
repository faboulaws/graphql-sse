import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Entity, EntityService } from './entity.service';

const serviceByEntityType = {

};

export const InjectEntityService = createParamDecorator(
    <T extends Entity>(entityType: typeof T, ctx: ExecutionContext) => {
        console.log(entityType.name)
        if (!serviceByEntityType[entityType.name]) {
            serviceByEntityType[entityType.name] = new EntityService<T>()
        }

        if(!serviceByEntityType[entityType.name]){
            throw new Error(`Failure creating EntityService for ${entityType.name}`)
        }

        return serviceByEntityType[entityType.name]
    },
);