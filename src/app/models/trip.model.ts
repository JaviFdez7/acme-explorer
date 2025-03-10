export class Trip {
  private _ticker!: string;
  private _title!: string;
  private _description!: string;
  private _price!: number;
  private _requirements!: string[];
  private _startDate!: Date;
  private _endDate!: Date;
  private _pictures?: string[];
  private _cancelation?: string;

  constructor(
    ticker?: string,
    title?: string,
    description?: string,
    price?: number,
    requirements?: string[],
    startDate?: Date,
    endDate?: Date,
    pictures?: string[],
    cancelation?: string
  ) {
    this._ticker = ticker || '';
    this._title = title || '';
    this._description = description || '';
    this._price = price || 0;
    this._requirements = requirements || [];
    this._startDate = startDate || new Date();
    this._endDate = endDate || new Date();
    this._pictures = pictures;
    this._cancelation = cancelation;
  }

  public get ticker(): string {
    return this._ticker;
  }

  public get title(): string {
    return this._title;
  }

  public get description(): string {
    return this._description;
  }

  public get price(): number {
    return this._price;
  }

  public get requirements(): string[] {
    return this._requirements;
  }

  public get startDate(): Date {
    return this._startDate;
  }

  public get endDate(): Date {
    return this._endDate;
  }

  public get pictures(): string[] {
    return this._pictures || [];
  }

  public get cancelation(): string {
    return this._cancelation || '';
  }
}

