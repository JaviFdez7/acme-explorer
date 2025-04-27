export class Entity {
  private _id!: string;
  private _version!: number;
  private _deleted!: boolean;

  constructor() {
    this._id = '';
    this._version = 0;
    this._deleted = false;
  }

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get version(): number {
    return this._version;
  }

  public set version(value: number) {
    this._version = value;
  }

  public get deleted(): boolean {
    return this._deleted;
  }

  public set deleted(value: boolean) {
    this._deleted = value;
  }
}
