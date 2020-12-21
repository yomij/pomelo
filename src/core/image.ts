import { readImage, drawImage } from '../utils/image.util';
import { PomeloRecord, Record } from './record';
import Hook from "./hook";

let id = 0;

const HOOKS =
  [
    'beforeTransform',
    'transform',
    'afterTransform',
    'beforeRender',
    'render',
    'afterRender',
  ]

export enum Operation {
  ADD = 'ADD',
  REDUCE = 'REDUCE',
  SPIN = 'SPIN',
  ZOOM = 'ZOOM',
  ZOOM_OUT = 'ZOOM_OUT',
  RENDER = 'RENDER',
}

export interface Image {
  load: (src: string, width: number, height: number) => PomeloImage;
  hooks: { [key: string]: Hook }
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
  readonly width: number = 0;
  readonly height: number = 0;
  readonly hooks = {
    render: new Hook('render'),
  };

  constructor(option: ImageOptions) {
    const { src, width, height } = option;
    this.id = ++id;
    this.width = width;
    this.height = height;
    this.load(src, width, height);
  }

  get (key) {
    console.log('get', key)
  }

  /**
   * 加载图片
   * @param src 图片地址
   * @param width 图片宽
   * @param height 图片高
   */
  load(src: string, width: number, height: number) {
    readImage(src, width, height)
      .then((data) => {
        this.data = data;
        this.loaded = true;
        // 分发loaded事件
      })
      .catch(e => {
        throw e;
      });
    return this;
  };

  add (image: PomeloImage) {
    this._addRecord(Operation.ADD, image)
  }

  render (target: string | HTMLElement) {
    if (typeof target === "string") {
      target = document.getElementById(target) as HTMLElement;
    }
    if (!target) {
      throw Error('target not found');
    }
    this._addRecord(Operation.RENDER, this)

    // TODO render 时清空记录
  }

  private _addRecord (type: string, data: PomeloImage | null) {
    let record: Record = {
      name: type,
      isExec: false,
      data,
    };
    this.record.add(record);
  }

}
