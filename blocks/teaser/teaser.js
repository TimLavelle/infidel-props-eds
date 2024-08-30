export default async function decorate(block) {
  //   const [bg, fg] = block.children;
  const props = [...block.children];
  const mediaBlock = props[0];
  const textBlock = props[1];
  const teaserClassName = props[2].textContent.trim();
  console.log(props);

  // Set standar Classnames
  const teaserBody = 'teaser-body';
  const teaserImage = 'teaser-image';

  // If there's a Style assigned to the teaser, append it to the main block and remove from output
  if (teaserClassName !== undefined) {
    // Add the Clasname to the main block div
    block.classList.add(teaserClassName);

    // Remove the element from Rendering
    // TODO Would this still output to SEO and is there a better way to manage styles
    block.lastElementChild.remove();
  }

  // Decorate the Teaserbody
  if (mediaBlock !== undefined) {
    mediaBlock.classList.add(teaserImage);
  }

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
