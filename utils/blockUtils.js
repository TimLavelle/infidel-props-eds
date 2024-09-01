export function addBlockClasses(block, childElements) {
    childElements.forEach(({ key, className }, index) => {
      const blockItem = block.children[index];
      if (blockItem) {
        blockItem.classList.add(className);
        childElements[index].blockItem = blockItem;
      } 
    });
  }
  
  export function removeUtilityElements(childElements, keysToRemove) {
    keysToRemove.forEach(key => {
      const item = childElements.find(item => item.key === key);
      if (item && item.blockItem) {
        item.blockItem.remove();
      }
    });
  }

  export function getTrimmedContent(childElements, key) {
    const item = childElements.find(item => item.key === key);
    return item && item.blockItem ? item.blockItem.textContent.trim() : null;
  }