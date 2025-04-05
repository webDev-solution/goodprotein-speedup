

function showStickyBar() {
  var rect = document.querySelector('.wrap_quanty_btn .add-to-cart-btn').getBoundingClientRect();
  if (rect.top < 0) {
    document.querySelector('.product-sticky-bar').classList.add('active');
  } else {
    document.querySelector('.product-sticky-bar').classList.remove('active');
  }
}

document.querySelector('.product-sticky-bar .btn').addEventListener('click', function (e) {
  e.preventDefault();
  var top = document.querySelector('.wrap_quanty_btn').offsetTop;
  console.log(top)
  if (window.innerWidth > 989) {
    window.scrollTo(0, 0);
  } else {
    window.scrollTo(0, top);
  }
  
})


showStickyBar();
window.addEventListener('scroll', showStickyBar, false);
