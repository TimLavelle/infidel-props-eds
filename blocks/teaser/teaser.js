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

  // Check if imageLink has content
  const imageLinkElement = childElements.find(item => item.key === 'imageLink').teaserItem;
  if (imageLinkElement && imageLinkElement.textContent.trim()) {
    const link = document.createElement('a');
    link.href = imageLinkElement.textContent.trim();
    link.classList.add('teaser-link');
    link.setAttribute('tabindex', '0');
    link.setAttribute('aria-label', 'Read more about ' + (childElements.find(item => item.key === 'title').teaserItem?.textContent.trim() || 'this topic'));

    // Wrap the entire block content with the link
    block.parentNode.insertBefore(link, block);
    link.appendChild(block);

    // Make internal elements focusable and clickable
    const interactiveElements = block.querySelectorAll('a, button');
    interactiveElements.forEach(element => {
      element.setAttribute('tabindex', '0');
      element.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
        }
      });
    });

    // Prevent the main link from activating when clicking on interactive elements
    block.addEventListener('click', (e) => {
      if (e.target !== link) {
        e.preventDefault();
      }
    });
  }
}
