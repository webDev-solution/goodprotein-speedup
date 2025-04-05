document.addEventListener('alpine:init', () => {
  Alpine.store('modals', {
    leftDrawer: { open: false, contents: '' },
    menuDrawer: { open: false, contents: '' },
    rightDrawer: { open: false, contents: '' },
    modal: { open: false, contents: '' },
    popup: { open: false, contents: '' },
    quickviewDrawer:{open:!1,contents:""},
    modals: {},
    register(name, slotName) {
      this.modals[name] = slotName;
    },
    open(name) {
      if (this.modals[name]) {
        const slotName = this.modals[name];

        document.body.dispatchEvent(
          new CustomEvent(`${name}-will-open`, { bubbles: true })
        );

        document.body.dispatchEvent(
          new CustomEvent(
            `${slotName.replace('Drawer', '-drawer')}-will-open`,
            { bubbles: true }
          )
        );

        this[slotName].contents = name;
        this[slotName].open = true;

        document.body.dispatchEvent(
          new CustomEvent(`${name}-is-open`, { bubbles: true })
        );

        document.body.dispatchEvent(
          new CustomEvent(`${slotName.replace('Drawer', '-drawer')}-is-open`, {
            bubbles: true,
          })
        );
      }
    },
    close(nameOrSlotName) {
      let name, slotName;

      if (this.modals[nameOrSlotName]) {
        name = nameOrSlotName;
        slotName = this.modals[nameOrSlotName];
      } else {
        name = this[nameOrSlotName.contents];
        slotName = nameOrSlotName;
      }

      document.body.dispatchEvent(
        new CustomEvent(`${name}-will-close`, { bubbles: true })
      );

      this[slotName].open = false;

      setTimeout(() => {
        this[slotName].contents = '';
      }, 300);

      document.body.dispatchEvent(
        new CustomEvent(`${name}-is-closed`, { bubbles: true })
      );
    },
    toggle(name) {
      if (this.modals[name]) {
        const slotName = this.modals[name];
        console.log(this[slotName].open)
        if (this[slotName].open == false) {
          this.open(name);
        } else {
          this.close(name);
        }
        
      }
    }
  });
});
