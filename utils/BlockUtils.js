export class BlockUtils {
  constructor(block, childElements) {
    this.block = block;
    this.childElements = childElements;
    console.log('BlockUtils constructor called');
    console.log('block:', this.block);
    console.log('childElements:', this.childElements);
    this.addBlockClasses();
  }

  addBlockClasses() {
    console.log('addBlockClasses method called');
    if (!this.childElements || this.childElements.length === 0) {
      console.warn('childElements is empty or undefined');
      return;
    }
    this.childElements.forEach(({ key, className }, index) => {
      console.log(`Processing element ${index}: key=${key}, className=${className}`);
      const blockItem = this.block.children[index];
      if (blockItem) {
        console.log(`Adding class ${className} to element`, blockItem);
        blockItem.classList.add(className);
        this.childElements[index].blockItem = blockItem;
      } else {
        console.warn(`No matching block child for index ${index}`);
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