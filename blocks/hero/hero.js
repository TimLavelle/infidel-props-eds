import { loadEager } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // Your block decoration logic here

  // Define LCP blocks for this specific block
  const heroLCPBlocks = ['hero'];

  // Call loadEager with the specific LCP blocks
  await loadEager(document, heroLCPBlocks);

  // Rest of your block logic
}
