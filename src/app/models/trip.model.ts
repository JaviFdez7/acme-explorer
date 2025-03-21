import { Entity } from "./entity.model";

export class Trip extends Entity{
  private _ticker!: string;
  private _title!: string;
  private _description!: string;
  private _price!: number;
  private _requirements!: string[];
  private _startDate!: Date;
  private _endDate!: Date;
  private _pictures?: { itemImageSrc: string; alt?: string }[];
  private _cancelation?: string;

  constructor() {
    super();
  }

  public get ticker(): string {
    return this._ticker;
  }

  public set ticker(value: string) {
    this._ticker = value;
  }

  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    this._description = value;
  }

  public get price(): number {
    return this._price;
  }

  public set price(value: number) {
    this._price = value;
  }

  public get requirements(): string[] {
    return this._requirements;
  }

  public set requirements(value: string[]) {
    this._requirements = value;
  }

  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(value: Date) {
    this._startDate = value;
  }

  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(value: Date) {
    this._endDate = value;
  }

  public get pictures(): { itemImageSrc: string; alt?: string }[] {
    return this._pictures || [];
  }

  public set pictures(value: { itemImageSrc: string; alt?: string }[]) {
    this._pictures = value;
  }

  public get cancelation(): string {
    return this._cancelation || '';
  }

  public set cancelation(value: string) {
    this._cancelation = value;
  }
}
