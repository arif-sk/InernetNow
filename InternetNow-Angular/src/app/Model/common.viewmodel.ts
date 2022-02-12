export class PrintObjectViewModel {
  constructor(init?: Partial<PrintObjectViewModel>) {
    (this.fileSize = 0), (this.isNeumericCount = false);
    this.isAlphaneumericCount = false;
    this.isFloatCount = false;
    this.applyConfiguration = false;
    this.numericPercentage = 0;
    this.alphanumericPercentage = 0;
    this.floatPercentage = 0;
    Object.assign(this, init);
  }
  fileSize: number;
  isNeumericCount: boolean;
  isAlphaneumericCount: boolean;
  isFloatCount: boolean;
  applyConfiguration: boolean;
  numericPercentage: number;
  alphanumericPercentage: number;
  floatPercentage: number;
}

export class FileContentViewModel {
  constructor(init?: Partial<FileContentViewModel>) {
    this.neumericCount = 0;
    this.alphaneumericCount = 0;
    this.floatCount = 0;
    this.contentItems = [];
    Object.assign(this, init);
  }
  neumericCount: number;
  alphaneumericCount: number;
  floatCount: number;
  contentItems: string[];
}

export class ObjectCountViewModel {
  constructor(init?: Partial<ObjectCountViewModel>) {
    this.numberCount = 0;
    this.floatCount = 0;
    this.characterCount = 0;
    Object.assign(this, init);
  }
  numberCount: number;
  floatCount: number;
  characterCount: number;
}
