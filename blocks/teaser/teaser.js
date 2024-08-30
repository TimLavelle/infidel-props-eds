export default async function decorate(block) {

  const childElements = {
    titleBlock: { className: 'teaser-title' },
    hasImageBlock: { className: 'teaser-has-image' },
    mediaBlock: { className: 'teaser-image' },
    preTitleTextBlock: { className: 'teaser-pre-title' },
    textBlock: { className: 'teaser-body' }
  };

  Object.entries(childElements).forEach(([key, { className }], index) => {
    const element = block.children[index];
    if (element) {
      if (element.textContent.trim()) {
        element.classList.add(className);
        childElements[key].element = element;
      } else {
        element.remove();
      }
    }
  });

  if (childElements.hasImageBlock.element) {
    childElements.hasImageBlock.element.remove();
  }
}
