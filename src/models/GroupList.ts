import { SourceGroup } from 'src/interfaces/Destination';

export default class GroupList {
  private groups: SourceGroup[];
  private readPointer: number;

  constructor(groups: SourceGroup[]) {
    this.groups = groups;
    this.readPointer = 0;
  }

  getGroup(): SourceGroup | null {
    if (this.readPointer === this.groups.length) {
      return null;
    }
    const returning = this.groups[this.readPointer];
    this.readPointer++;
    return returning;
  }
}
