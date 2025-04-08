import { Entity } from './entity.model';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  DUE = 'DUE',
  ACCEPTED = 'ACCEPTED',
}

export class Application extends Entity {
  private _trip!: string;
  private _actor!: string;
  private _status!: ApplicationStatus;
  private _messages!: string[];
  private _date!: Date;
  private _reason?: string;

  public constructor(trip: string, actor: string, messages?: string[], status?: ApplicationStatus, date?: Date, reason?: string, version?: number, deleted?: boolean) {
    super();
    this._trip = trip;
    this._actor = actor;
    this._status = status || ApplicationStatus.PENDING;
    this._date = date || new Date();
    this._messages = messages || [];

    if (reason !== undefined) {
      this._reason = reason;
    }
    if (version !== undefined) {
      this.version = version;
    }
    if (deleted !== undefined) {
      this.deleted = deleted;
    }
  }

  public get status(): ApplicationStatus {
    return this._status;
  }

  public set status(value: ApplicationStatus) {
    this._status = value;
  }

  public get trip(): string {
    return this._trip;
  }

  public set trip(value: string) {
    this._trip = value;
  }

  public get actor(): string {
    return this._actor;
  }

  public set actor(value: string) {
    this._actor = value;
  }

  public get messages(): string[] {
    return this._messages;
  }

  public set messages(value: string[]) {
    this._messages = value;
  }

  public addMessage(message: string): void {
    this._messages.push(message);
  }

  public removeMessage(index: number): void {
    if (index >= 0 && index < this._messages.length) {
      this._messages.splice(index, 1);
    }
  }

  public get date(): Date {
    return this._date;
  }

  public set date(value: Date) {
    this._date = value;
  }

  public get reason(): string | undefined {
    return this._reason;
  }

  public set reason(value: string | undefined) {
    this._reason = value;
  }

  public get object(): any {
    return {
      version: this.version,
      deleted: this.deleted,
      status: this.status,
      trip: this.trip,
      actor: this.actor,
      messages: this.messages,
      date: this.date,
      reason: this.reason
    };
  }
}