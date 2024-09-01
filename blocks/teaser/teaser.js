import { addBlockClasses, removeUtilityElements } from '../../utils/BlockUtils.js';

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
  
  addBlockClasses(block, childElements);
  removeUtilityElements(childElements, ['hasImage', 'hasCTA', 'imageLink']);
}
