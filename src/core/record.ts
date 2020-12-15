// interface Record {
//
// }

import {PomeloImage} from "./image";

export type Record = {
  name: string;
  isExec: boolean;
  image: PomeloImage;
}

const TIME_OUT = 50

export class PomeloRecord {
  private record: Array<Record> = [];
  private cacheCount: number = 0;

  private timeOut: number = -10000;

  get count(): number {
    return this.record.length
  }

  public add(record: Record) {
    if (this.timeOut) clearTimeout(this.timeOut)
    this.record.push(record);
    this.timeOut = window.setTimeout(this.exec, TIME_OUT)
  }

  exec () {

  }

  merge () {

  }
}

