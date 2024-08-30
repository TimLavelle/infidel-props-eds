export default async function decorate(block) {
  //   const [bg, fg] = block.children;
  const [titleBlock, hasImageBlock, mediaBlock, preTitletextBlock, textBlock] = [...block.children].map(child);
  console.log(titleBlock);

  // Set standard Classnames
  const teaserBody = 'teaser-body';
  const teaserImage = 'teaser-image';

  // Decorate the Teaserbody
  if (mediaBlock) mediaBlock.classList.add(teaserImage);

  // Decorate the Teaserbody
  if (textBlock) {
    textBlock.classList.add(teaserBody);

    const teaserTitle = textBlock.querySelector('h3');
    const [teaserPreTitle, teaserDescription] = textBlock.querySelectorAll('p');

    if (teaserTitle) teaserTitle.classList.add('teaser-title');
    if (teaserPreTitle) {
      teaserPreTitle.classList.add('teaser-pre-title');
      // Remove this line if the 'test' id is not needed
      // teaserPreTitle.setAttribute('id', 'test');
    }
    if (teaserDescription) teaserDescription.classList.add('teaser-text');
  }
}
