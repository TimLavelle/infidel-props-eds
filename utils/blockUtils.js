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
    keysToRemove.forEach((keyToRemove) => {
      const utilityItem = this.childElements.find((childElement) => childElement.key === keyToRemove);
      if (utilityItem && utilityItem.blockItem) {
        utilityItem.blockItem.remove();
      }
    });
  }

  /* Get the trimmed content of a child element */
  getTrimmedContent(contentKey) {
    const contentItem = this.childElements.find((childElement) => childElement.key === contentKey);
    return contentItem && contentItem.blockItem ? contentItem.blockItem.textContent.trim() : null;
  }
}
