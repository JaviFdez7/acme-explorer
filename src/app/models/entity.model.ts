export class Entity {
  private _id!: string;
  private _version!: number;
  private _deleted!: boolean;

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

  public get deleted(): boolean {
    return this._deleted;
  }

  public set deleted(value: boolean) {
    this._deleted = value;
  }
}
