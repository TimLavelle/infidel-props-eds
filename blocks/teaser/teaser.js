export default async function decorate(block) {

  const childElements = [
    { key: 'title', className: 'teaser-title' },
    { key: 'imageLink', className: 'teaser-img-link' },
    { key: 'hasImage', className: 'teaser-has-img' },
    { key: 'media', className: 'teaser-image' },
    { key: 'preTitle', className: 'teaser-pre-title' },
    { key: 'body', className: 'teaser-body' },
    { key: 'hasCTA', className: 'teaser-ctas' },
    { key: 'ctaLinkOne', className: 'teaser-ctas' },
    { key: 'ctaLinkOneText', className: 'teaser-cta1-text' },
    { key: 'ctaLinkOneTitle', className: 'teaser-cta1-title' },
    { key: 'ctaLinkTwo', className: 'teaser-ctas' },
    { key: 'ctaLinkTwoText', className: 'teaser-cta2-text' },
    { key: 'ctaLinkTwoTitle', className: 'teaser-cta2-title' }
  ];
  
  // Add the teaser classes to the child elements for styling
  childElements.forEach(({ key, className }, index) => {
    const teaserItem = block.children[index];
    if (teaserItem) {
      teaserItem.classList.add(className);
      childElements[index].teaserItem = teaserItem;
    } 
  });

  // Get rid of the selector block to show/hide the optional elements in the authoring dialogue
  ['hasImage', 'hasCTA', 'imageLink'].forEach(key => {
    if (childElements.find(item => item.key === key).teaserItem) {
      childElements.find(item => item.key === key).teaserItem.remove();
    }
  });

  
}
