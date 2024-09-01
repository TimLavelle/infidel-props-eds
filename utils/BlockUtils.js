export class BlockUtils {
  constructor(block, childElements) {
    this.block = block;
    this.childElements = childElements;
    this.addBlockClasses();
  }

  addBlockClasses() {
    if (!this.childElements || this.childElements.length === 0) {
      return;
    }
    this.childElements.forEach(({ key, className }, index) => {
      const blockItem = this.block.children[index];
      if (blockItem) {
        blockItem.classList.add(className);
        this.childElements[index].blockItem = blockItem;
      } 
    });
  }

  removeUtilityElements(keysToRemove) {
    keysToRemove.forEach(key => {
      const item = this.childElements.find(item => item.key === key);
      if (item && item.blockItem) {
        item.blockItem.remove();
      }
    });
  }

  getTrimmedContent(key) {
    const item = this.childElements.find(item => item.key === key);
    return item && item.blockItem ? item.blockItem.textContent.trim() : null;
  }
}