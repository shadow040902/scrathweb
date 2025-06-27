// --- SEARCH BOX ---
const searchBox = document.getElementById('search-box');
const searchIcon = document.getElementById('search-icon');
const closeIcon = document.getElementById('close-icon');
const input = document.getElementById('search-input');

if (searchBox && searchIcon && closeIcon && input) {
  searchIcon.addEventListener('click', () => {
    searchBox.classList.add('active');
    input.style.display = 'inline-block';
    closeIcon.style.display = 'inline-block';
    searchIcon.style.display = 'none';
    input.focus();
  });

  closeIcon.addEventListener('click', () => {
    input.value = '';
    searchBox.classList.remove('active');
    input.style.display = 'none';
    closeIcon.style.display = 'none';
    searchIcon.style.display = 'inline-block';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      searchBox.classList.remove('active');
      input.style.display = 'none';
      closeIcon.style.display = 'none';
      searchIcon.style.display = 'inline-block';
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchBox.contains(e.target)) {
      input.value = '';
      searchBox.classList.remove('active');
      input.style.display = 'none';
      closeIcon.style.display = 'none';
      searchIcon.style.display = 'inline-block';
    }
  });
}

// --- FEATURED BLOG SLIDER ---
document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.blog-slide');
  const prevBtn = document.querySelector('.blog-slider-btn.prev');
  const nextBtn = document.querySelector('.blog-slider-btn.next');
  const dotsContainer = document.querySelector('.blog-slider-dots');
  let currentSlide = 0;
  let autoSlideInterval = null;

  if (slides.length && prevBtn && nextBtn && dotsContainer) {
    
    slides.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'blog-slider-dot' + (idx === 0 ? ' active' : '');
      dot.addEventListener('click', () => showSlide(idx, true));
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.blog-slider-dot');

    function showSlide(idx, resetAuto = false) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = (idx + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
      if (resetAuto) {
        resetAutoSlide();
      }
    }

    prevBtn.onclick = () => showSlide(currentSlide - 1, true);
    nextBtn.onclick = () => showSlide(currentSlide + 1, true);

    // Tự động chuyển slide
    function autoSlide() {
      showSlide(currentSlide + 1);
    }
    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(autoSlide, 5000);
    }
    resetAutoSlide();

    // Dừng tự động khi hover slider, tiếp tục khi rời chuột
    const slider = document.querySelector('.blog-slider');
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', resetAutoSlide);
  }
});