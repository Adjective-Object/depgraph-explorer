export class Palette {
  private palette: string[];
  private colorCounter = 0;
  private assignedColors = new Map();

  constructor(palette: string[]) {
    this.palette = palette;
  }

  getColorForName(name: string): string {
    if (!this.assignedColors.has(name)) {
      this.assignedColors.set(
        name,
        this.palette[this.colorCounter++ % this.palette.length],
      );
    }
    return this.assignedColors.get(name);
  }
}
