window['ThemeSection_ProductQuickBuy'] = ({
  product,
  variant,
  featuredMediaID,
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
    addedToCart: false,
    get currentVariantId() {
      if (this.current_variant) {
        return this.current_variant.id;
      } else {
        return null;
      }
    },
    get currentVariantAvailable() {
      if (this.current_variant) {
        return this.current_variant.available;
      } else {
        return null;
      }
    },
    get current_price() {
      return this.current_variant.price;
    },
    formatMoney(price) {
      return formatMoney(price, theme.moneyFormat);
    },
    init() {
      function formatState (state) {
        if (!state.id) { return state.text; }
        var $state = $(
          '<div class="flavour-option"><span class="flavour-bg"></span> <span class="flavour-text"></span></div>'
        );
    
        $state.find(".flavour-text").text(state.text);
        $state.find(".flavour-bg").css('background-color',state.element.attributes[0].value);
        $state.find(".flavour-bg").html('<img src="'+state.element.attributes[1].value+'"/>');
    
        return $state;
      };
    
      $("[name=falvour-box]").select2({
        templateSelection: formatState,
        templateResult: formatState,
        minimumResultsForSearch: -1
      });

      $(this.$root).on('change','[name=falvour-box]',function(){
        console.log($(this).val());
        Alpine.store('modals').close('quickview');
        document.getElementById($(this).val()).click();
      });

      $(this.$root).on('click','.desktop_flavours_list .inner_shakes a',function(e){
        e.preventDefault();
        console.log($(this).attr('href'));
        Alpine.store('modals').close('quickview');
        document.getElementById($(this).attr('href')).click();
      });

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
    },
    mainSelectorChange() {
      const matchedVariant = ShopifyProduct.getVariantFromId(
        this.product,
        parseInt(this.$refs.singleVariantSelector.value)
      );
      this.updateVariant(matchedVariant);
    },
    optionChange() {
      this.getOptions();
      const matchedVariant = ShopifyProduct.getVariantFromOptionArray(
        this.product,
        this.options
      );
      this.updateVariant(matchedVariant);
    },
    updateVariant(variant) {
      this.current_variant = variant;
      if (this.current_variant) {
        if (this.current_variant.featured_media) {
          this.current_media_id = this.current_variant.featured_media.id;
        }
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
            const value = selector.value;
            this.options.push(value);
            this.optionHandles.push(selector.dataset.handle);
          }
        }
      });
    },
    submitForm(evt) {
      evt.preventDefault();
      this.loading = true;

      liveRegion(window.theme.strings.loading);
      const formData = new FormData(
        this.$root.querySelector('.quick-buy-product-form')
      );
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
          Alpine.store('modals').close('quickview');
        })
        .catch((error) => {
          error.json().then((a) => {
            this.loading = false;
            alert(a.description);
          });
        });
    },
  };
};
