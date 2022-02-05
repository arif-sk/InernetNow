export class PrintObjectViewModel {
  constructor(init?: Partial<PrintObjectViewModel>) {
    this.fileSize = 0,
    this.isNeumericCount = false;
    this.isAlphaneumericCount = false;
    this.isFloatCount = false;
    this.neumericCount = 0,
    this.alphaNeumericCount = 0,
    this.floatCount = 0
    Object.assign(this, init);
  }
  fileSize: number;
  isNeumericCount: boolean;
  isAlphaneumericCount: boolean;
  isFloatCount: boolean;
  neumericCount: number;
  alphaNeumericCount: number;
  floatCount: number;

}

export class FileContentViewModel{
    constructor(init?: Partial<FileContentViewModel>) {
        this.neumericCount = 0;
        this.alphaneumericCount = 0;
        this.floatCount = 0;
        this.contentItems = []
        Object.assign(this, init);
      }
    neumericCount: number;
    alphaneumericCount: number;
    floatCount: number;
    contentItems: string[]
}