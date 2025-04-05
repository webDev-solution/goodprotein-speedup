document.addEventListener('alpine:init', () => {
  Alpine.data('ThemeSection_ProductQuickView', (section_id) => {
    return {
      init() {
        Alpine.store('modals').register('quickview', 'quickviewDrawer');
        this.$root.querySelector('.product-tile .shop_now_btn .btn').addEventListener('click', this.renderContent.bind(this));
        
      },
      renderContent(evt) {
        evt.preventDefault();
        document.getElementById('quickview-container').querySelectorAll('.product-quickview-content').forEach(element => {
          element.remove();
        });
        initTeleport(this.$refs.modalContent);
        Alpine.store('modals').open('quickview');
      }
    };
  });
});
