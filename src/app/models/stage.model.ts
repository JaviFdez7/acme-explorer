export class Stage{
  private _title!: string;
  private _description!: string;
  private _price!: number;

  constructor(title: string, description: string, price: number) {
    this._title = title;
    this._description = description;
    this._price = price;
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

  public get object(): object {
    return {
      title: this._title,
      description: this._description,
      price: this._price,
    };
  }

}