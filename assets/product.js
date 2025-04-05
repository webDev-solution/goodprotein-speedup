window['ThemeSection_Product'] = ({
  product,
  variant,
  featuredMediaID,
  template,
  thumbnailsPosition,
  showThumbnailsOnMobile,
}) => {
  return {
    productRoot: null,
    product: product,
    current_variant: variant,
    featured_media_id: featuredMediaID,
    current_media_id: featuredMediaID,
    loading: false,
    quantity: '1',
    options: [],
    optionHandles: [],
    storeAvailability: null,
    addedToCart: false,
    stickyAddToCartShown: false,
    template: template,
    thumbnailsPosition: thumbnailsPosition,
    showThumbnailsOnMobile: showThumbnailsOnMobile,
    get addToCartText() {
      if (this.current_variant) {
        if (this.loading) {
          return window.theme.strings.loading;
        }
        if (!this.loading && this.current_variant.available) {
          if (this.template === 'product.preorder') {
            return window.theme.strings.preOrder;
          } else {
            return window.theme.strings.addToCart;
          }
        }
        if (this.product.tags.indexOf('out of stock') > -1) {
          return window.theme.strings.soldOut;
        } else {
          if (!this.loading && !this.current_variant.available) {
            return window.theme.strings.soldOut;
          }
        }
        
      } else {
        return window.theme.strings.unavailable;
      }
    },
    get currentVariantId() {
      if (this.current_variant) {
        return this.current_variant.id;
      } else {
        return null;
      }
    },
    get currentVariantAvailabilityClosestLocation() {
      // this is on a lag to the actual current variant so that we can display an intermediary state while the fetch request is happening
      if (!Alpine.store('availability')) return null;

      const id = this.currentVariantId;
      const storeData = Alpine.store('availability').availability[id];
      if (storeData) {
        return storeData.closest_location;
      } else {
        return null;
      }
    },
    get currentVariantAvailable() {
      if (this.current_variant) {
        if (product.tags.indexOf('out of stock') > -1) {
          return null;
        } else {
          return this.current_variant.available;
        }
        
      } else {
        return null;
      }
    },
    get currentVariantTitle() {
      if (this.current_variant && this.current_variant.title) {
        if (!this.current_variant.title.includes('Default')) {
          return this.current_variant.title;
        }
      }
      return '';
    },
    get current_price() {
      return this.current_variant.price;
    },
    get isUsingSlideshowToDisplayMedia() {
      const splideEl = this.productRoot.querySelector('.splide--product');

      if (window.Splide && this.productRoot && splideEl) {
        if (
          window.slideshows &&
          window.slideshows[`${splideEl.id}`] &&
          !window.slideshows[`${splideEl.id}`].state.is(
            window.Splide.STATES.DESTROYED
          )
        ) {
          return true;
        }
      }

      return false;
    },
    formatMoney(price) {
      return formatMoney(price, theme.moneyFormat);
    },
    init() {
      // Set a product root for nested components
      // to use instead of $root (which refers to their root)
      this.productRoot = this.$root;

      if (this.$refs.productForm) {
        this.$refs.productForm.addEventListener(
          'submit',
          this.submitForm.bind(this)
        );
      }

      this.getOptions();
      this.getAddToCartButtonHeight();

      this.$watch('current_media_id', (value, oldValue) => {
        if (showThumbnailsOnMobile) {
          this.$root.dispatchEvent(
            new CustomEvent('shapes:product:mediachange', {
              bubbles: true,
              detail: {
                media_id: this.current_media_id,
                slideshow_id:
                  this.productRoot.querySelector('.splide--product')?.id,
              },
            })
          );
        }
        if (this.isUsingSlideshowToDisplayMedia) return;
        this.$root
          .querySelector(`[data-product-single-media-wrapper="${oldValue}"]`)
          .dispatchEvent(new CustomEvent('mediaHidden'));
        this.$root
          .querySelector(`[data-product-single-media-wrapper="${value}"]`)
          .dispatchEvent(new CustomEvent('mediaVisible'));
      });

      this.updateStoreAvailability(this.current_variant);
    },
    getAddToCartButtonHeight() {
      window.onload = function () {
        const height = document.querySelector('.add-to-cart-btn').offsetHeight;
        document.documentElement.style.setProperty(
          '--payment-button-height',
          `${height}px`
        );
      };
    },
    updateStoreAvailability(variant) {
      if (!this.$refs.storeAvailabilityContainer) return;
      this.storeAvailability =
        this.storeAvailability ||
        new StoreAvailability(this.$refs.storeAvailabilityContainer);

      if (this.storeAvailability && variant) {
        this.storeAvailability.fetchContent(variant);
      }
    },
    optionChange() {
      this.getOptions();

      const matchedVariant = ShopifyProduct.getVariantFromOptionArray(
        this.product,
        this.options
      );

      this.current_variant = matchedVariant;

      if (this.current_variant) {
        variantLiveRegion(this.current_variant);
        this.updateStoreAvailability(this.current_variant);

        if (this.current_variant.featured_media) {
          this.current_media_id = this.current_variant.featured_media.id;
        }
        const url = ShopifyProductForm.getUrlWithVariant(
          window.location.href,
          this.current_variant.id
        );

        window.history.replaceState({ path: url }, '', url);

        $('.overlay').show();
        fetch(this.product.handle + '?variant=' + this.current_variant.id,
          {
            credentials: "same-origin",
            method: "GET",
          }
        ).then(response => response.text())
        .then((data) =>{
          // console.log(data);
          
            //  const new_html1 = new DOMParser().parseFromString(data,'text/html').querySelector('.subscription-box').innerHTML;            
            //  $('.subscription-box').html(new_html1);
            //  $('.overlay').hide();
          } 
       );
        
       // location.reload(); // added by Daman
        this.$refs.singleVariantSelector.dispatchEvent(
          new Event('change', { bubbles: true })
        );
        // this.$root.dispatchEvent(
        //   new CustomEvent('shapes:product:variantchange', {
        //     bubbles: true,
        //     detail: { variant: this.current_variant },
        //   })
        // );
      }
    },
    getOptions() {
      this.options = [];
      this.optionHandles = [];

      let selectors = this.$root.querySelectorAll(
        '[data-single-option-selector]'
      );

      selectors.forEach((selector) => {
        if (selector.nodeName === 'SELECT') {
          const value = selector.value;
          this.options.push(value);
          this.optionHandles.push(
            selector.options[selector.selectedIndex].dataset.handle
          );
        } else {
          if (selector.checked) {
            console;
            const value = selector.value;
            this.options.push(value);
            this.optionHandles.push(selector.dataset.handle);
          }
        }
      });
    },
    optionSelect(value) {
      let selectors = this.$root.querySelector(
        '[data-single-option-selector]'
      );
      console.log(selectors)
      selectors.value = value;
      var event = new Event('change', {
        bubbles: true,
        cancelable: true,
      });
      selectors.dispatchEvent(event);
    },
    changeMedia(direction) {
      this.$root.dispatchEvent(
        new CustomEvent('shapes:product:arrow-change', {
          bubbles: true,
          detail: { direction: direction },
        })
      );
      if (this.thumbnailsPosition == 'under') {
        const currentThumbnail = this.$root.querySelector(
          '.product-thumbnail-list-item--active'
        );
        const nextElement =
          direction == 'prev'
            ? currentThumbnail.previousElementSibling
            : currentThumbnail.nextElementSibling;
        if (nextElement !== null) {
          nextElement.querySelector('.media-thumbnail').click();
        }
      }
    },
    submitForm(evt) {
      evt.preventDefault();
  
if(evt.submitter.classList.contains('lp_shakes_button')){

  /**/
  
 function addVariantsToCart(variants) {
   var i = 0;
  
    function rec_add(i){
      var formData = new FormData();

    formData.append('id', variants[i].id);
    formData.append('quantity', variants[i].quantity);
     
        fetch('/cart/add.js', {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
            i++;
            if(i < variants.length){
              rec_add(i);
            }

          document.querySelector('.alert_message_shakes').style.display = 'block';
        })
        .catch(function(error) {
           console.error('Error adding variants to cart:', error);
        })
       .finally(() => {
              if(document.querySelector('.lp_shakes_button').classList.contains('added')){
                setTimeout(function() {
                   window.location.href = '/checkout';
                },2000);     
              }
       });

        }
          rec_add(i);
      }
      
       var free_get = document.querySelectorAll('.free_product_with_add');          
          var sele_item1 = [];
          var sele_item2 = [];
         var sele_item3 = [];
          var get_qty = 0; 

      for(var i = 0; i< free_get.length; i++){
             var get_qty_val = parseInt(free_get[i].querySelector('.quantity-selector input').value);
               
              if(get_qty_val >= 1){
                if(free_get[i].querySelector('.covered_qty_shakes.show')){
                   var get_id = free_get[i].getAttribute('data-id');
                  var get_new_qty = parseInt(free_get[i].querySelector('.quantity-selector input').value);
                  get_qty = get_qty + get_new_qty;
                         
                        sele_item1.push({"id":parseInt(get_id),"quantity": parseInt(get_qty_val)});     
                }                
              }              
            }

   if(get_qty >= 1){
 var get_gift_first = document.querySelector('.no_gift_block').getAttribute('data-vid');
            sele_item2.push({"id":parseInt(get_gift_first),"quantity": parseInt(1)});  
   }
        if(get_qty >= 3){
            var get_gift_one = document.querySelector('.second_gift_block').getAttribute('data-vid');
            sele_item2.push({"id":parseInt(get_gift_one),"quantity": parseInt(1)});   
          }

        if(get_qty >= 6){
              var get_gift_two = document.querySelector('.third_gift_block').getAttribute('data-vid');
              sele_item2.push({"id":parseInt(get_gift_two),"quantity": parseInt(1)}); 
        }

       if(get_qty < 1){
         var newArr = sele_item1;
       }else{
         var newArr = sele_item1.concat(sele_item2);
       }

  if(sele_item1.length == 0){
    var get_cu_id = document.querySelector('.lp_shakes_button').getAttribute('data-cid');
     sele_item3.push({"id":parseInt(get_cu_id),"quantity": parseInt(get_qty_val)}); 
     var newArr = sele_item3;
}

   addVariantsToCart(newArr);

  /**/
  
}else{
   this.loading = true;

      liveRegion(window.theme.strings.loading);

      const formData = new FormData(this.$refs.productForm);

      let modalCart = theme.settings.cart_type === 'modal';

      const config = fetchConfigDefaults('javascript');

      if (modalCart) {
        formData.append('sections', 'cart-items,cart-footer,cart-item-count');
        formData.append('sections_url', window.location.pathname);
      }

      config.body = formData;

      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];
      fetch(`${theme.routes.cart_add_url}`, config)
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            this.loading = false;
            throw data.description;
          }
          this.loading = false;
          this.addedToCart = true;

          if (modalCart) {
            document.body.dispatchEvent(
              new CustomEvent('shapes:modalcart:afteradditem', {
                bubbles: true,
                detail: { response: data },
              })
            );
          }

          if (!document.querySelector('[data-show-on-add="true"]')) {
            if (this.$refs.added)
              this.$nextTick(() => this.$refs.added.focus());
          }
        })
        .catch((error) => {
          if (typeof error === 'string') {
            alert(error);
          } else {
            error.json().then((a) => {
              this.loading = false;
              alert(a.description);
            });
          }
        });
}




      
    },
    openZoom(id) {
      const imageZoomDataEl = this.productRoot.querySelector(
        '[data-photoswipe-images]'
      );

      if (!imageZoomDataEl) return;

      const imageZoomData = JSON.parse(imageZoomDataEl.innerHTML);

      const imageMediaIDsArray = Object.keys(imageZoomData);

      const index = imageMediaIDsArray.indexOf(id);

      this.$refs.photoSwipeComponent.dispatchEvent(
        new CustomEvent('shapes:photoswipe:open', {
          detail: {
            index: index,
          },
        })
      );
    },
  };
};

window['productThumbnails'] = () => {
  return {
    firstVisible: true,
    lastVisible: false,
    mounted() {
      const firstThumbnail = this.$refs.firstThumbnail;
      const lastThumbnail = this.$refs.lastThumbnail;
      const options = {
        root: this.$root.querySelector('.splide__track'),
        rootMargin: '0px',
        threshold: 1.0,
      };
      const firstThumbnailObserver = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.firstVisible = true;
          } else {
            this.firstVisible = false;
          }
        },
        options
      );
      const lastThumbnailObserver = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.lastVisible = true;
          } else {
            this.lastVisible = false;
          }
        },
        options
      );
      firstThumbnailObserver.observe(firstThumbnail);
      lastThumbnailObserver.observe(lastThumbnail);
    },
  };
};


/**/

 
function getTotalQuantity() {
    var get_qty_plus = 0;
  var get_price_total = 0;
    var free_get = document.querySelectorAll('.free_product_with_add');  
   
         for(var i = 0; i< free_get.length; i++){
             var get_qty_t = parseInt(free_get[i].querySelector('.quantity-selector input').value);  
         
           if(get_qty_t >= 1){
                if(free_get[i].querySelector('.covered_qty_shakes.show')){
                  var get_new_qty = parseInt(free_get[i].querySelector('.quantity-selector input').value);
                   get_qty_plus = parseInt(get_qty_plus + get_qty_t);
                }                
              }           
         }

  //  console.log(get_qty_plus);
    var get_prices = document.querySelector('.shakes_flavours_list').getAttribute('data-price');
    var total_price = get_prices*get_qty_plus;
  
     if(get_qty_plus >= 1){
        document.querySelector('.discount_message').classList.add('dis');
        document.querySelector('.total_amount_of_product .total').innerHTML = formatMoney(total_price, theme.moneyFormat);
       
      }else{
        document.querySelector('.discount_message').classList.remove('dis');
       document.querySelector('.total_amount_of_product .total').innerHTML = '';
      }


  
  if(get_qty_plus >= 1 && get_qty_plus <= 2){
    var i_value = document.querySelector('.shakes_input_hidden').getAttribute('data-done');
    document.querySelector('.discount_message .discount_value').innerHTML = '10%';
    document.querySelector('.no_gift_block span').style.display = 'block';
    document.querySelector('.second_gift_block span').style.display = 'none';
    document.querySelector('.third_gift_block span').style.display = 'none';
    var total_price_l = parseInt(total_price*10)/100;
     document.querySelector('.total_amount_of_product .amount').innerHTML = '(Saving ' + formatMoney(total_price_l, theme.moneyFormat) + ')';
    
  }else if(get_qty_plus >= 3 && get_qty_plus <= 5){
    var i_value = document.querySelector('.shakes_input_hidden').getAttribute('data-dtwo');
    document.querySelector('.discount_message .discount_value').innerHTML ='15%';
     document.querySelector('.second_gift_block span').style.display = 'block';
        document.querySelector('.third_gift_block span').style.display = 'none';
    var total_price_l = parseInt(total_price*15)/100;
    document.querySelector('.total_amount_of_product .amount').innerHTML = '(Saving ' + formatMoney(total_price_l, theme.moneyFormat) + ')';
    
  }else if(get_qty_plus >= 6){
    var i_value = document.querySelector('.shakes_input_hidden').getAttribute('data-dthree');    
    document.querySelector('.discount_message .discount_value').innerHTML = '20%';
    document.querySelector('.second_gift_block span').style.display = 'block';
    document.querySelector('.third_gift_block span').style.display = 'block';
    var total_price_l = parseInt(total_price*20)/100;
    document.querySelector('.total_amount_of_product .amount').innerHTML = '(Saving ' + formatMoney(total_price_l, theme.moneyFormat) + ')';
    
  }else{
     var i_value = document.querySelector('.shakes_input_hidden').getAttribute('data-price'); 
     document.querySelector('.no_gift_block span').style.display = 'none';
    document.querySelector('.second_gift_block span').style.display = 'none';
    document.querySelector('.third_gift_block span').style.display = 'none';
     document.querySelector('.total_amount_of_product .amount').innerHTML = '';
  }
  document.querySelector('.shakes_input_hidden').value = i_value;

}


var shake_add = document.querySelectorAll('.covered_qty_shakes .add_qty_shakes');

for (var i = 0; i < shake_add.length; i++) {
    shake_add[i].addEventListener("click", function() {
        this.parentElement.classList.add('show');
        jQuery('.continue_to_checkout_shakes').removeClass('gray-btn');
        jQuery('.continue_to_checkout_shakes').html('<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z"></path></svg> Checkout');
        getTotalQuantity();

    });
}


var quantityInputs = document.querySelectorAll('.quantity-selector input');
function updateQuantity(e) {

  var quantityInput = e.target.parentElement.querySelector('input');
  var quantity = parseInt(quantityInput.value);

  if (e.target.classList.contains('plus')) {
    if(quantity>5){ return; }
    quantity++;
  } else if (e.target.classList.contains('minus')) {
    if (quantity > 1) {
      quantity--;
    }else{
     e.target.parentElement.parentElement.classList.remove('show');
    
    }
  }
  
  quantityInput.value = quantity.toString();

      getTotalQuantity();
  
}

for (var i = 0; i < quantityInputs.length; i++) {
  var minusButton = quantityInputs[i].previousElementSibling;
  var plusButton = quantityInputs[i].nextElementSibling;

  minusButton.addEventListener('click', updateQuantity);
  plusButton.addEventListener('click', updateQuantity);
}


/**/

jQuery('body').on('click','.common_gift',function(){
 //  jQuery(this).toggleClass('selected-gift');
});

jQuery('body').on('click','.continue_to_checkout_shakes',function(){
   var check = false;
   jQuery('.inner_flavours_list .free_product_with_add').each(function(){
       if(jQuery(this).find('.covered_qty_shakes').hasClass('show')){
           check = true;
       }
   });
  if(!check){
    jQuery(this).html('Select at least 1 bag');
    jQuery(this).addClass('gray-btn');
  }  else {
       jQuery(this).removeClass('gray-btn');
      jQuery(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z"></path></svg> Checkout');
       jQuery('.lp_shakes_button').trigger('click');
       jQuery('.lp_shakes_button').addClass('added');
    }
});

jQuery('body').on('click','.minus',function(){
  jQuery(this).closest('.quantity-selector').removeClass('gray-disable');
  var check = false;
   jQuery('.inner_flavours_list .free_product_with_add').each(function(){
       if(jQuery(this).find('.covered_qty_shakes').hasClass('show')){
           check = true;
       }
   });
      if(!check){
    jQuery('.continue_to_checkout_shakes').html('Select at least 1 bag');
    jQuery('.continue_to_checkout_shakes').addClass('gray-btn');
  }
});

jQuery('body').on('click','.quantity-selector button, .add_qty_shakes',function(){
   var quant = 0;
//  var items = jQuery(this).closest('.free_product_with_add');
  var siblings = jQuery('.inner_flavours_list .free_product_with_add');
  jQuery('.inner_flavours_list .free_product_with_add').each(function(){
    if(jQuery(this).find('.covered_qty_shakes').hasClass('show')){
      quant += parseInt(jQuery(this).find('[type=number]').val());
    }
  });
    if(quant>5){
      siblings.addClass('max-added');
    } else {
      siblings.removeClass('max-added');
    }
});

jQuery('body').on('click','.plus',function(){
  
  if(jQuery(this).prev().val()==6){
     jQuery(this).closest('.quantity-selector').addClass('gray-disable');
  }
  else {
     jQuery(this).closest('.quantity-selector').removeClass('gray-disable');
  }
});

function addToCart(params) {
  
}




if(document.querySelectorAll('.continue_to_checkout_shakes').length > 0){
document.querySelector('.continue_to_checkout_shakes').addEventListener("click", function() {
  
 // document.querySelector('.lp_shakes_button').click();
//  document.querySelector('.lp_shakes_button').classList.add('added');
});
}

if(document.querySelectorAll('.covered_flavours_list .first_current_selected_li').length > 0){
document.querySelector('.covered_flavours_list .first_current_selected_li').addEventListener("click", function() {
      document.querySelector(".product-block.product-block-title.break-words").scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
    document.querySelector('.covered_flavours_list').classList.toggle('active');
});
}


jQuery(document).on('click', function (e) {
    if (jQuery(e.target).closest(".covered_flavours_list").length === 0) {
        jQuery('.covered_flavours_list').removeClass('active');
    }
});