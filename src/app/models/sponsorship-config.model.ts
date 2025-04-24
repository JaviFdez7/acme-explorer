import { Entity } from './entity.model';

export class SponsorshipConfig extends Entity {
  private _price!: number;

  public constructor(price: number, version?: number, deleted?: boolean) {
    super();
    this._price = price;
    if (version !== undefined) {
      this.version = version;
    }
    if (deleted !== undefined) {
      this.deleted = deleted;
    }
  }

  public get price(): number {
    return this._price;
  }

  public set price(value: number) {
    this._price = value;
  }

  public get object(): any {
    return {
      version: this.version,
      deleted: this.deleted,
      price: this.price
    };
  }
}
