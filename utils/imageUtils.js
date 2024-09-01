export function createResponsiveImage(src, alt = '', className = '') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = className;
    img.loading = 'lazy';
  
    const setImageSize = () => {
      const container = img.closest('.flight-deal-image-container');
      if (container) {
        const containerWidth = container.offsetWidth;
        img.width = containerWidth;
        img.height = Math.round(containerWidth * (3 / 4)); // Assuming 4:3 aspect ratio
      }
    };
  
    // Set initial size
    setTimeout(setImageSize, 0);
  
    // Update size on window resize
    window.addEventListener('resize', setImageSize);
  
    return img;
  }