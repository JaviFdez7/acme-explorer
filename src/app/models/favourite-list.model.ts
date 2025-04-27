import { Entity } from './entity.model';

export class FavouriteList extends Entity {
  private _name!: string;
  private _tripLinks?: string[];

  public constructor(id: string, name: string, tripLinks?: string[], version?: number, deleted?: boolean) {
    super();
    this.id = id;
    this._name = name;
    this._tripLinks = tripLinks;
    if (version !== undefined) {
      this.version = version;
    }
    if (deleted !== undefined) {
      this.deleted = deleted;
    }
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get tripLinks(): string[] | undefined {
    return this._tripLinks;
  }

  public set tripLinks(value: string[] | undefined) {
    this._tripLinks = value;
  }

  public get object(): any {
    return {
      version: this.version,
      deleted: this.deleted,
      name: this.name,
      tripLinks: this.tripLinks
    };
  }
}
