const favoriteButtons = document.querySelectorAll('.favorite-icon');

favoriteButtons.forEach(button => {
  button.addEventListener('click', function() {
    this.classList.toggle('filled');
    if (this.classList.contains('filled')) {
      this.innerHTML = '&#10084;'; // 实心爱心
    } else {
      this.innerHTML = '&#9825;'; // 空心爱心
    }
  });
});