export default async function decorate(block) {

  const childElements = {
    titleBlock: { className: 'teaser-title' },
    hasImageBlock: { className: 'teaser-has-image' },
    mediaBlock: { className: 'teaser-image' },
    preTitleTextBlock: { className: 'teaser-pre-title' },
    bodyBlock: { className: 'teaser-body' }
  };
  
  Object.entries(childElements).forEach(([key, { className }], index) => {
    const teaserItem = block.children[index];
    if (teaserItem) {
      teaserItem.classList.add(className);
      childElements[key].teaserItem = teaserItem;
    } 
  });

  // Get rid of the selector block to show/hide the image authoring dialogue
  if (childElements.hasImageBlock.teaserItem) {
    childElements.hasImageBlock.teaserItem.remove();
  }
}
