import { Entity } from './entity.model';

export class Sponsorship extends Entity {
  private _bannerUrl!: string;
  private _infoPageUrl!: string;
  private _sponsor!: string;
  private _paid!: boolean;

  public constructor(bannerUrl: string, infoPageUrl: string, sponsor: string, paid: boolean, version?: number, deleted?: boolean) {
    super();
    this._bannerUrl = bannerUrl;
    this._infoPageUrl = infoPageUrl;
    this._sponsor = sponsor;
    this._paid = paid;
    if (version !== undefined) {
      this.version = version;
    }
    if (deleted !== undefined) {
      this.deleted = deleted;
    }
  }

  public get bannerUrl(): string {
    return this._bannerUrl;
  }

  public set bannerUrl(value: string) {
    this._bannerUrl = value;
  }

  public get infoPageUrl(): string {
    return this._infoPageUrl;
  }

  public set infoPageUrl(value: string) {
    this._infoPageUrl = value;
  }

  public get sponsor(): string {
    return this._sponsor;
  }

  public set sponsor(value: string) {
      this._sponsor = value;
  }

  public get paid(): boolean {
    return this._paid;
  }

  public set paid(value: boolean) {
    this._paid = value;
  }

  public get object(): any {
    return {
      version: this.version,
      deleted: this.deleted,
      bannerUrl: this.bannerUrl,
      infoPageUrl: this.infoPageUrl,
      sponsor: this.sponsor,
      paid: this.paid
    };
  }
}
