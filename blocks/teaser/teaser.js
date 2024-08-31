export default async function decorate(block) {

  const childElements = [
    { key: 'title', className: 'teaser-title' },
    { key: 'imageLink', className: 'teaser-img-link' },
    { key: 'hasImage', className: 'teaser-has-img' },
    { key: 'media', className: 'teaser-image' },
    { key: 'preTitle', className: 'teaser-pre-title' },
    { key: 'body', className: 'teaser-body' },
    { key: 'hasCTA', className: 'teaser-ctas' },
    { key: 'ctaLinkOne', className: 'teaser-cta1' },
    { key: 'ctaLinkOneText', className: 'teaser-cta1-text' },
    { key: 'ctaLinkOneTitle', className: 'teaser-cta1-title' },
    { key: 'ctaLinkTwo', className: 'teaser-cta2' },
    { key: 'ctaLinkTwoText', className: 'teaser-cta2-text' },
    { key: 'ctaLinkTwoTitle', className: 'teaser-cta2-title' }
  ];

  const teaserList = document.createElement('ul');
  teaserList.className = 'teaser-list';

  const teaserItem = document.createElement('li');
  teaserItem.className = 'teaser-item';

  childElements.forEach(({ key, className }, index) => {
    const element = block.children[index];
    if (element) {
      element.classList.add(className);
      teaserItem.appendChild(element);
    }
  });

  const imageLink = teaserItem.querySelector('.teaser-img-link');
  const ctaLinkOne = teaserItem.querySelector('.teaser-cta1');
  const ctaLinkTwo = teaserItem.querySelector('.teaser-cta2');

  if (imageLink) {
    const imageLinkHref = imageLink.textContent.trim();
    const mediaElement = teaserItem.querySelector('.teaser-image');

    if (imageLinkHref === ctaLinkOne?.textContent.trim() || imageLinkHref === ctaLinkTwo?.textContent.trim()) {
      // Whole card is clickable
      const cardLink = document.createElement('a');
      cardLink.href = imageLinkHref;
      cardLink.className = 'teaser-card-link';
      cardLink.setAttribute('aria-label', `${teaserItem.querySelector('.teaser-title').textContent.trim()} (Link to full article)`);

      teaserItem.querySelectorAll('a').forEach(link => {
        link.setAttribute('tabindex', '-1');
        link.setAttribute('aria-hidden', 'true');
      });

      teaserItem.appendChild(cardLink);
    } else {
      // Only media element is clickable
      if (mediaElement) {
        const mediaLink = document.createElement('a');
        mediaLink.href = imageLinkHref;
        mediaLink.className = 'teaser-media-link';
        mediaLink.setAttribute('aria-label', `Image for ${teaserItem.querySelector('.teaser-title').textContent.trim()}`);
        
        const image = document.createElement('img');
        image.src = mediaElement.src;
        image.alt = mediaElement.alt || '';
        image.className = mediaElement.className;

        mediaLink.appendChild(image);
        mediaElement.parentNode.replaceChild(mediaLink, mediaElement);
      }
    }
  }

  // Remove selector blocks
  ['hasImage', 'hasCTA', 'imageLink'].forEach(key => {
    const element = teaserItem.querySelector(`.${childElements.find(item => item.key === key).className}`);
    if (element) {
      element.remove();
    }
  });

  teaserList.appendChild(teaserItem);
  block.textContent = '';
  block.appendChild(teaserList);
}
