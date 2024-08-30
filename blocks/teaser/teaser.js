export default function decorate(block) {
  const [mediaBlock, textBlock, styleBlock] = block.children;
  const teaserClassName = styleBlock?.textContent.trim();

  // Add style class and remove style block
  if (teaserClassName) {
    block.classList.add(teaserClassName);
    styleBlock.remove();
  }

  // Decorate media block
  mediaBlock?.classList.add('teaser-image');

  // Decorate text block
  if (textBlock) {
    textBlock.classList.add('teaser-body');

    const teaserTitle = textBlock.querySelector('h3');
    const [teaserPreTitle, teaserDescription] = textBlock.querySelectorAll('p');

    teaserTitle?.classList.add('teaser-title');
    teaserPreTitle?.classList.add('teaser-pre-title');
    teaserDescription?.classList.add('teaser-text');
  }
}
