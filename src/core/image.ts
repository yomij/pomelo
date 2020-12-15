import { readImage } from '../utils/image.util';
import { PomeloRecord, Record } from './record'

let id = 0;

export enum Operation {
  ADD = 'ADD',
  REDUCE = 'REDUCE',
  SPIN = 'SPIN',
  ZOOM = 'ZOOM',
  ZOOM_OUT = 'ZOOM_OUT',
}

export interface Image {
  load: (src: string, width: number, height: number) => PomeloImage
}

interface ImageOptions {
  src: string;
  width: number;
  height: number;
}

export class PomeloImage implements Image {
  public data: ImageData;
  private loaded: boolean = false;
  private record: PomeloRecord = new PomeloRecord();
  private id: number;

  constructor(option: ImageOptions) {
    const { src, width, height } = option;
    this.id = ++id;
    this.load(src, width, height);
  }

  load(src: string, width: number, height: number) {
    readImage(src, width, height)
      .then((data) => {
        this.data = data;
        this.loaded = true;
      })
      .catch(e => {
        throw e;
      });
    return this;
  };

  add (image: PomeloImage) {
    let record: Record = {
      name: Operation.ADD,
      isExec: false,
      image,
    };
    this.record.add(record)
  }

}
