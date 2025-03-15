import MobileMenu from "mmenu-light";
import Swal from "sweetalert2";
import Anime from "./partials/anime";
import initTootTip from "./partials/tooltip";
import AppHelpers from "./app-helpers";

class App extends AppHelpers {
  constructor() {
    super();
    window.app = this;
  }

  loadTheApp() {
    this.commonThings();
    this.initiateNotifier();
    this.initiateMobileMenu();
    if (header_is_sticky) {
      this.initiateStickyMenu();
    }
    this.initAddToCart();
    this.initiateAdAlert();
    this.initiateDropdowns();
    this.initiateModals();
    this.initiateCollapse();
    this.initAttachWishlistListeners();
    this.changeMenuDirection();
    this.ALU_extractfooterimage();
    this.ALU_searchIcon();
    this. ALU__removeShadowroot();
    initTootTip();
    this.loadModalImgOnclick();

    salla.comment.event.onAdded(() => window.location.reload());

    this.status = "ready";
    document.dispatchEvent(new CustomEvent("theme::ready"));
    this.log("Theme Loaded 🎉");
  }

  log(message) {
    salla.log(`ThemeApp(Raed)::${message}`);
    return this;
  }

  // fix Menu Direction at the third level >> The menu at the third level was popping off the page
  changeMenuDirection() {
    app.all(".root-level.has-children", (item) => {
      if (item.classList.contains("change-menu-dir")) return;
      app.on("mouseover", item, () => {
        let submenu = item.querySelector(".sub-menu .sub-menu");
        if (submenu) {
          let rect = submenu.getBoundingClientRect();
          (rect.left < 10 || rect.right > window.innerWidth - 10) &&
            app.addClass(item, "change-menu-dir");
        }
      });
    });
  }
  ALU_extractfooterimage() {
    setTimeout(() => {
      const sallaPayments = document.querySelector(".salla-payments_footer");
      const verificationContainer = document.querySelector(".verification");
      const targetImageSrc =
        "https://cdn.salla.network/cdn-cgi/image/fit=scale-down,width=58,height=58,onerror=redirect,format=auto/images/sbc.png";
      if (sallaPayments) {
        const lastLi = sallaPayments.querySelector("li:last-child");
        if (lastLi) {
          const img = lastLi.querySelector("img");
          if (img && img.src === targetImageSrc) {
            const newLocation = document.querySelector("#new-location");
            if (newLocation) {
              newLocation.appendChild(lastLi);
            }
          } else {
            verificationContainer?.remove();
          }
        } else {
          verificationContainer?.remove();
        }
      } else {
        verificationContainer?.remove();
      }
    }, 200);
  }
  ALU_searchIcon() {
    // salla search
    let searchElements = document.querySelectorAll(".Moa_search");
    let searchIcons = document.querySelectorAll(".header-search");

    searchElements.forEach((search, index) => {
      let searchIcon = searchIcons[index];

      search.addEventListener("click", function (event) {
        event.stopPropagation();
        searchIcon.classList.toggle("active");
        searchIcon.classList.toggle("hidden");
      });

      document.addEventListener("click", function (event) {
        if (
          !search.contains(event.target) &&
          !searchIcon.contains(event.target)
        ) {
          searchIcon.classList.remove("active");
          searchIcon.classList.add("hidden");
        }
      });
    });
  }
  ALU__removeShadowroot() {
    setTimeout(() => {
      const hostElements = document.querySelectorAll('.s-add-product-button-main .s-add-product-button-mini-checkout');
      hostElements.forEach(el => {
        if (el && el.shadowRoot) {
          const button = el.shadowRoot.querySelector('.s-fast-checkout-button');
          if (button) {
            button.style.borderRadius = '0';
            console.log('Button styled successfully!');
          } else {
            console.error('Button not found inside shadow root');
          }
        } else {
          console.error('Shadow root not found or not accessible');
        }
      });
    }, 200);
  }
  loadModalImgOnclick() {
    document.querySelectorAll(".load-img-onclick").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        let modal = document.querySelector("#" + link.dataset.modalId),
          img = modal.querySelector("img"),
          imgSrc = img.dataset.src;
        modal.open();

        if (img.classList.contains("loaded")) return;

        img.src = imgSrc;
        img.classList.add("loaded");
      });
    });
  }

  commonThings() {
    this.cleanContentArticles(".content-entry");
  }

  cleanContentArticles(elementsSelector) {
    let articleElements = document.querySelectorAll(elementsSelector);

    if (articleElements.length) {
      articleElements.forEach((article) => {
        article.innerHTML = article.innerHTML.replace(/\&nbsp;/g, " ");
      });
    }
  }

  isElementLoaded(selector) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (document.querySelector(selector)) {
          clearInterval(interval);
          return resolve(document.querySelector(selector));
        }
      }, 160);
    });
  }

  copyToClipboard(event) {
    event.preventDefault();
    let aux = document.createElement("input"),
      btn = event.currentTarget;
    aux.setAttribute("value", btn.dataset.content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    this.toggleElementClassIf(btn, "copied", "code-to-copy", () => true);
    setTimeout(() => {
      this.toggleElementClassIf(btn, "code-to-copy", "copied", () => true);
    }, 1000);
  }

  initiateNotifier() {
    salla.notify.setNotifier(function (message, type, data) {
      if (typeof message == "object") {
        return Swal.fire(message).then(type);
      }

      return Swal.mixin({
        toast: true,
        position: salla.config.get("theme.is_rtl") ? "top-start" : "top-end",
        showConfirmButton: false,
        timer: 2000,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      }).fire({
        icon: type,
        title: message,
        showCloseButton: true,
        timerProgressBar: true,
      });
    });
  }

  initiateMobileMenu() {
    this.isElementLoaded("#mobile-menu").then((menu) => {
      const mobileMenu = new MobileMenu(
        menu,
        "(max-width: 1024px)",
        "( slidingSubmenus: false)"
      );

      salla.lang.onLoaded(() => {
        mobileMenu.navigation({
          title: salla.lang.get("blocks.header.main_menu"),
        });
      });
      const drawer = mobileMenu.offcanvas({
        position: salla.config.get("theme.is_rtl") ? "right" : "left",
      });

      this.onClick("a[href='#mobile-menu']", (event) => {
        document.body.classList.add("menu-opened");
        event.preventDefault() || drawer.close() || drawer.open();
      });
      this.onClick(".close-mobile-menu", (event) => {
        document.body.classList.remove("menu-opened");
        event.preventDefault() || drawer.close();
      });
    });
  }

  initAttachWishlistListeners() {
    let isListenerAttached = false;

    function toggleFavoriteIcon(id, isAdded = true) {
      document
        .querySelectorAll('.s-product-card-wishlist-btn[data-id="' + id + '"]')
        .forEach((btn) => {
          app.toggleElementClassIf(
            btn,
            "s-product-card-wishlist-added",
            "not-added",
            () => isAdded
          );
          app.toggleElementClassIf(
            btn,
            "pulse-anime",
            "un-favorited",
            () => isAdded
          );
        });
    }

    if (!isListenerAttached) {
      salla.wishlist.event.onAdded((event, id) => toggleFavoriteIcon(id));
      salla.wishlist.event.onRemoved((event, id) =>
        toggleFavoriteIcon(id, false)
      );
      isListenerAttached = true; // Mark the listener as attached
    }
  }

  initiateStickyMenu() {
    let header = this.element("#mainnav"),
      height = this.element("#mainnav .inner")?.clientHeight;
    //when it's landing page, there is no header
    if (!header) {
      return;
    }

    window.addEventListener("load", () =>
      setTimeout(() => this.setHeaderHeight(), 500)
    );
    window.addEventListener("resize", () => this.setHeaderHeight());

    window.addEventListener(
      "scroll",
      () => {
        window.scrollY >= header.offsetTop + height
          ? header.classList.add("fixed-pinned", "animated")
          : header.classList.remove("fixed-pinned");
        window.scrollY >= 200
          ? header.classList.add("fixed-header")
          : header.classList.remove("fixed-header", "animated");
      },
      { passive: true }
    );
  }

  setHeaderHeight() {
    let height = this.element("#mainnav .inner").clientHeight,
      header = this.element("#mainnav");
    header.style.height = height + "px";
  }

  /**
   * Because salla caches the response, it's important to keep the alert disabled if the visitor closed it.
   * by store the status of the ad in local storage `salla.storage.set(...)`
   */
  initiateAdAlert() {
    let ad = this.element(".salla-advertisement");

    if (!ad) {
      return;
    }

    if (!salla.storage.get("statusAd-" + ad.dataset.id)) {
      ad.classList.remove("hidden");
    }

    this.onClick(".ad-close", function (event) {
      event.preventDefault();
      salla.storage.set("statusAd-" + ad.dataset.id, "dismissed");

      anime({
        targets: ".salla-advertisement",
        opacity: [1, 0],
        duration: 300,
        height: [ad.clientHeight, 0],
        easing: "easeInOutQuad",
      });
    });
  }

  initiateDropdowns() {
    this.onClick(".dropdown__trigger", ({ target: btn }) => {
      btn.parentElement.classList.toggle("is-opened");
      document.body.classList.toggle("dropdown--is-opened");
      // Click Outside || Click on close btn
      window.addEventListener("click", ({ target: element }) => {
        if (
          (!element.closest(".dropdown__menu") && element !== btn) ||
          element.classList.contains("dropdown__close")
        ) {
          btn.parentElement.classList.remove("is-opened");
          document.body.classList.remove("dropdown--is-opened");
        }
      });
    });
  }

  initiateModals() {
    this.onClick("[data-modal-trigger]", (e) => {
      let id = "#" + e.target.dataset.modalTrigger;
      this.removeClass(id, "hidden");
      setTimeout(() => this.toggleModal(id, true)); //small amont of time to running toggle After adding hidden
    });
    salla.event.document.onClick("[data-close-modal]", (e) =>
      this.toggleModal("#" + e.target.dataset.closeModal, false)
    );
  }

  toggleModal(id, isOpen) {
    this.toggleClassIf(
      `${id} .s-salla-modal-overlay`,
      "ease-out duration-300 opacity-100",
      "opacity-0",
      () => isOpen
    )
      .toggleClassIf(
        `${id} .s-salla-modal-body`,
        "ease-out duration-300 opacity-100 translate-y-0 sm:scale-100", //add these classes
        "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95", //remove these classes
        () => isOpen
      )
      .toggleElementClassIf(
        document.body,
        "modal-is-open",
        "modal-is-closed",
        () => isOpen
      );
    if (!isOpen) {
      setTimeout(() => this.addClass(id, "hidden"), 350);
    }
  }

  initiateCollapse() {
    document.querySelectorAll(".btn--collapse").forEach((trigger) => {
      const content = document.querySelector("#" + trigger.dataset.show);
      const state = { isOpen: false };

      const onOpen = () =>
        anime({
          targets: content,
          duration: 225,
          height: content.scrollHeight,
          opacity: [0, 1],
          easing: "easeOutQuart",
        });

      const onClose = () =>
        anime({
          targets: content,
          duration: 225,
          height: 0,
          opacity: [1, 0],
          easing: "easeOutQuart",
        });

      const toggleState = (isOpen) => {
        state.isOpen = !isOpen;
        this.toggleElementClassIf(
          content,
          "is-closed",
          "is-opened",
          () => isOpen
        );
      };

      trigger.addEventListener("click", () => {
        const { isOpen } = state;
        toggleState(isOpen);
        isOpen ? onClose() : onOpen();
      });
    });
  }

  /**
   * Workaround for seeking to simplify & clean, There are three ways to use this method:
   * 1- direct call: `this.anime('.my-selector')` - will use default values
   * 2- direct call with overriding defaults: `this.anime('.my-selector', {duration:3000})`
   * 3- return object to play it letter: `this.anime('.my-selector', false).duration(3000).play()` - will not play animation unless calling play method.
   * @param {string|HTMLElement} selector
   * @param {object|undefined|null|null} options - in case there is need to set attributes one by one set it `false`;
   * @return {Anime|*}
   */
  anime(selector, options = null) {
    let anime = new Anime(selector, options);
    return options === false ? anime : anime.play();
  }

  /**
   * These actions are responsible for pressing "add to cart" button,
   * they can be from any page, especially when mega-menu is enabled
   */
  initAddToCart() {
    salla.cart.event.onUpdated((summary) => {
      document
        .querySelectorAll("[data-cart-total]")
        .forEach((el) => (el.innerHTML = salla.money(summary.total)));
      document
        .querySelectorAll("[data-cart-count]")
        .forEach((el) => (el.innerText = salla.helpers.number(summary.count)));
    });

    salla.cart.event.onItemAdded((response, prodId) => {
      app
        .element("salla-cart-summary")
        .animateToCart(app.element(`#product-${prodId} img`));
    });
  }

  addCartListener() {
    const free_shipping_element = document.querySelector('.free_shipping_progress_bar');
    if (!free_shipping_element) return;
    const free_shipping_limit = parseInt(free_shipping_element?.dataset.freeShippingLimit) || 1000;

    salla.event.on('cart::updated', function (data) {
        document.querySelector('.progress_filler').style.width = `${(data.total / free_shipping_limit) * 100}%`;
        const freeShippingLimitRemaining = document.querySelector('.free_shipping_limit_remaining');
        if (freeShippingLimitRemaining) {
            freeShippingLimitRemaining.innerText = salla.money(
                free_shipping_limit - data.total > 0 ? free_shipping_limit - data.total : 0
            );
        }
    });
  }
}
class TabComponent extends HTMLElement {
    constructor() {
        super();

        const template = document.querySelector('#AL-best_category_tabs');
        if (!template) {
            console.error("Template #AL-best_category_tabs not found!");
            return;
        }

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));

        this.initTabs();
    }

    initTabs() {
        const tabs = this.shadowRoot.querySelectorAll('.AL-best_category_tabs_btn');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.changeTab(tab);
            });
        });

        if (tabs.length > 0) this.changeTab(tabs[0]);
    }

    changeTab(selectedTab) {
        this.shadowRoot.querySelectorAll('.AL-best_category_tabs_item')
            .forEach(tab => tab.classList.remove('tab_active'));
    
        selectedTab.closest('.AL-best_category_tabs_item').classList.add('tab_active');
    
        const slots = this.parentElement.querySelectorAll('custom-tabs tab-content');
        
        slots.forEach(slot => slot.setAttribute('hidden', ''));
    
        const activeSlot = this.parentElement.querySelector(`custom-tabs tab-content[slot="${selectedTab.textContent.trim()}"]`);
        
        if (activeSlot) activeSlot.removeAttribute('hidden');
    }
}

window.customElements.define('custom-tabs', TabComponent);

salla.onReady(() => (new App).loadTheApp());

