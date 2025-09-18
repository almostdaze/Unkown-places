// script.js
// Dynamic gallery + tab handling for "Unknown Places" site
// Place this file in the project root and include it with <script src="script.js"></script>

document.addEventListener('DOMContentLoaded', () => {
  // ========== Configure your gallery images here ==========
  // Provide correct relative paths to the images in your repo (case-sensitive).
  const gallery = {
    mountains: [
      'images/mount1.jpg',
      'images/mount2.jpg',
      'images/mount3.jpg'
    ],
    forests: [
      'images/for1.jpg',
      'images/for2.jpg',
      'images/for3.jpg'
    ],
    lakes: [
      'images/lake1.jpg',
      'images/lake2.jpg',
      'images/lake3.jpg'
    ]
  };

  // ========== Keep existing openTab functionality (exposed globally) ==========
  window.openTab = function(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(c => c.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
  };

  // ========== Create a modal/gallery overlay (programmatically) ==========
  const modal = document.createElement('div');
  modal.id = 'gallery-modal';
  // Basic inline styles so you don't need extra CSS files; tweak later if you want.
  modal.style.cssText = [
    'position: fixed',
    'inset: 0',
    'display: none',
    'align-items: center',
    'justify-content: center',
    'background: rgba(0,0,0,0.85)',
    'z-index: 2000'
  ].join(';');

  const inner = document.createElement('div');
  inner.style.cssText = 'position: relative; max-width: 92%; max-height: 92%;';

  const img = document.createElement('img');
  img.style.cssText = 'max-width: 100%; max-height: 100%; display:block; border-radius:8px; box-shadow: 0 8px 30px rgba(0,0,0,0.6);';
  img.alt = 'Gallery image';

  // Controls: prev / next / close
  const prevBtn = document.createElement('button');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.textContent = '‹';
  prevBtn.style.cssText = 'position:absolute; left:-55px; top:50%; transform:translateY(-50%); font-size:40px; background:none; border:none; color:white; cursor:pointer;';

  const nextBtn = document.createElement('button');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.textContent = '›';
  nextBtn.style.cssText = 'position:absolute; right:-55px; top:50%; transform:translateY(-50%); font-size:40px; background:none; border:none; color:white; cursor:pointer;';

  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = 'position:absolute; right:0; top:-50px; font-size:22px; background:none; border:none; color:white; cursor:pointer;';

  // Optional caption
  const caption = document.createElement('div');
  caption.style.cssText = 'margin-top:8px; color:white; text-align:center; font-size:16px;';

  inner.appendChild(img);
  inner.appendChild(prevBtn);
  inner.appendChild(nextBtn);
  inner.appendChild(closeBtn);
  inner.appendChild(caption);
  modal.appendChild(inner);
  document.body.appendChild(modal);

  let currentGallery = [];
  let currentIndex = 0;

  function openGallery(category) {
    const arr = gallery[category] || [];
    if (!arr.length) {
      alert(`No images configured for "${category}". Update script.js with correct image paths.`);
      return;
    }
    currentGallery = arr;
    currentIndex = 0;
    img.src = currentGallery[currentIndex];
    caption.textContent = `${category} — ${currentIndex + 1} / ${currentGallery.length}`;
    modal.style.display = 'flex';
    // prevent page scroll while modal open
    document.body.style.overflow = 'hidden';
  }

  function closeGallery() {
    modal.style.display = 'none';
    img.src = '';
    caption.textContent = '';
    document.body.style.overflow = '';
  }

  function showIndex(i) {
    if (!currentGallery.length) return;
    currentIndex = (i + currentGallery.length) % currentGallery.length; // wrap around
    img.src = currentGallery[currentIndex];
    caption.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
  }

  // Controls events
  prevBtn.addEventListener('click', () => showIndex(currentIndex - 1));
  nextBtn.addEventListener('click', () => showIndex(currentIndex + 1));
  closeBtn.addEventListener('click', closeGallery);

  // Close when clicking outside the inner box
  modal.addEventListener('click', (e) => { if (e.target === modal) closeGallery(); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'flex') return;
    if (e.key === 'ArrowLeft') showIndex(currentIndex - 1);
    if (e.key === 'ArrowRight') showIndex(currentIndex + 1);
    if (e.key === 'Escape') closeGallery();
  });

  // Attach event listeners to the Explore buttons inside each tab
  // The selector matches the Explore buttons you added inside each .tab-content
  document.querySelectorAll('.tab-content .tab-buttons button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // find the parent tab id (mountains / forests / lakes)
      const tab = btn.closest('.tab-content');
      if (!tab) return;
      const id = tab.id;
      openGallery(id);
    });
  });

});
