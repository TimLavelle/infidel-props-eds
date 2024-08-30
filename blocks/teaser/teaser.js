export default async function decorate(block) {

  const childElements = {
    titleBlock: { className: 'teaser-title' },
    hasImageBlock: { className: 'teaser-has-image' },
    mediaBlock: { className: 'teaser-image' },
    preTitleTextBlock: { className: 'teaser-pre-title' },
    bodyBlock: { className: 'teaser-body' }
  };

  console.log(block.children);
  
  Object.entries(childElements).forEach(([key, { className }], index) => {
    const element = block.children[index];
    if (element) {
      element.classList.add(className);
      childElements[key].element = element;
    } 
  });

  // Get rid of the selector block to show/hide the image authoring dialogue
  if (childElements.hasImageBlock.element) {
    childElements.hasImageBlock.element.remove();
  }
}
