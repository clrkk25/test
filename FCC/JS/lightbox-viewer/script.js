const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    // 从图像的 src 属性中删除 -thumbnail 以获取全尺寸版本
    lightboxImage.src = item.src.replace('-thumbnail', '');
    lightbox.style.display = 'flex';
  });
});
const lightbox = document.querySelector('.lightbox');
const closeBtn = document.getElementById('close-btn');
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
});
