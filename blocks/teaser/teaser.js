export default async function decorate(block) {

  const childElements = {
    title: { className: 'teaser-title' },
    imageLink: { className: 'teaser-title' },
    hasImage: { className: 'teaser-img-link' },
    media: { className: 'teaser-image' },
    preTitle: { className: 'teaser-pre-title' },
    body: { className: 'teaser-body' },
    hasCTA: { className: 'teaser-ctas' },
    cta: { className: 'teaser-ctas' }
  };
  
  // Add the teaser classes to the child elements for styling
  Object.entries(childElements).forEach(([key, { className }], index) => {
    const teaserItem = block.children[index];
    if (teaserItem) {
      teaserItem.classList.add(className);
      childElements[key].teaserItem = teaserItem;
    } 
  });

  // Get rid of the selector block to show/hide the optional elements in the authoring dialogue
  ['hasImage', 'hasCTA'].forEach(key => {
    if (childElements[key].teaserItem) {
      childElements[key].teaserItem.remove();
    }
  });
}
