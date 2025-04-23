import { Entity } from './entity.model';

export class Finder extends Entity {
  private _actor: string;
  private _searchQuery: string;
  private _minPrice: number | null;
  private _maxPrice: number | null;
  private _startDate: string | null;
  private _endDate: string | null;
  
  public constructor(actor: string, searchQuery: string, minPrice: number, maxPrice: number, startDate: string, endDate: string, version?: number, deleted?: boolean) {
    super();
    this._actor = actor;
    this._searchQuery = searchQuery;
    this._minPrice = minPrice
    this._maxPrice = maxPrice
    this._startDate = startDate;
    this._endDate = endDate;
    if (version !== undefined) {
        this.version = version;
    }
    if (deleted !== undefined) {
    this.deleted = deleted;
    }
  }

  public get searchQuery(): string {
    return this._searchQuery;
  }

  public set searchQuery(value: string) {
    this._searchQuery = value;
  }

  public get minPrice(): number | null {
    return this._minPrice;
  }

  public set minPrice(value: number | null) {
    this._minPrice = value;
  }

  public get maxPrice(): number | null {
    return this._maxPrice;
  }

  public set maxPrice(value: number | null) {
    this._maxPrice = value;
  }

  public get startDate(): string | null {
    return this._startDate;
  }

  public set startDate(value: string | null) {
    this._startDate = value;
  }

  public get endDate(): string | null {
    return this._endDate;
  }

  public set endDate(value: string | null) {
    this._endDate = value;
  }

  public get actor(): string {
    return this._actor;
  }

  public set actor(value: string) {
    this._actor = value;
  }

  public get object(): any {
    return {
      version: this.version,
      deleted: this.deleted,
      actor: this.actor,
      searchQuery: this.searchQuery,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      startDate: this.startDate,
      endDate: this.endDate
    };
  }
}
