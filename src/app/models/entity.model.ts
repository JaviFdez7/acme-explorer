export class Entity {
  private _id!: string;
  private _version!: number;
  private _available!: boolean;

  constructor() {
    this._id = '';
    this._version = 0;
  }

  public get id(): string {
    return this._id;
  }

  public get version(): number {
    return this._version;
  }

  public get available(): boolean {
    return this._available;
  }
}
