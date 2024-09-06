export default class BlockUtils {
  constructor(block, childElements) {
    this.block = block;
    this.childElements = childElements;
    this.addBlockClasses();
  }

  /* Add classes to the block and its child elements for better styling */
  addBlockClasses() {
    if (!this.childElements || this.childElements.length === 0) {
      return;
    }
    this.childElements.forEach(({ className }, index) => {
      const blockItem = this.block.children[index];
      if (blockItem) {
        blockItem.classList.add(className);
        this.childElements[index].blockItem = blockItem;
      }
    });
  }

  /* Remove utility elements that are not needed for presentation */
  removeUtilityElements(keysToRemove) {
    keysToRemove.forEach((key) => {
      const removeItem = this.childElements.find((item) => item.key === key);
      if (removeItem && removeItem.blockItem) {
        removeItem.blockItem.remove();
      }
    });
  }

  /* Get the trimmed content of a child element */
  getTrimmedContent(key) {
    const trimmedItem = this.childElements.find((item) => item.key === key);
    return trimmedItem && trimmedItem.blockItem ? trimmedItem.blockItem.textContent.trim() : null;
  }
}
