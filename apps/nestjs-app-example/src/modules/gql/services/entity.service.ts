import { Injectable } from '@nestjs/common';

export interface Entity {
    id: number
    dateCreated: Date
}

@Injectable()
export class EntityService<T extends Entity> {

    private entities: T[] = [];

    create(dto: Omit<T, "id" | "dateCreated">): T {
        const entity: T = { ...dto, dateCreated: new Date(), id: this.entities.length + 1 } as T;
        this.entities.push(entity);
        return entity;
    }

    getEntities(filter?: Partial<T>): T[] {
        let entitiesBy = [...this.entities];
        Object.entries(filter).forEach(([key, value]) => {
            entitiesBy = entitiesBy.filter(entity => (value === undefined || entity[key] === value))
        })
        return entitiesBy;
    }

    deleteBy(id: number) {
        this.entities = this.entities.filter(entity => entity.id === id);
    }
}



