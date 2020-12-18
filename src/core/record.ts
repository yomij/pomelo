// interface Record {
//
// }

import {PomeloImage} from "./image";

export type Record = {
  name: string;
  isExec: boolean;
  data: PomeloImage | null;
  fn?: Function;
}

const TIME_OUT = 50

export class PomeloRecord {
  private record: Array<Record> = [];
  private cacheCount: number = 0;

  private timeOut: number = -10000;

  get size(): number {
    return this.record.length
  }

  public add(record: Record) {
    if (this.timeOut) clearTimeout(this.timeOut)
    // TODO 识别能否合并，不能合并的直接执行
    this.record.push(record);
    this.timeOut = window.setTimeout(this.exec, TIME_OUT)
  }

  exec () {

  }

  merge () {

  }
}

