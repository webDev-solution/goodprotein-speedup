import { S as Splide } from './shared-import-splide.esm.bundle.js';
/*!
 * @splidejs/splide-extension-auto-scroll
 * Version  : 0.5.3
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */

function empty(array) {
  array.length = 0;
}

function slice$1(arrayLike, start, end) {
  return Array.prototype.slice.call(arrayLike, start, end);
}

function apply$1(func) {
  return func.bind.apply(func, [null].concat(slice$1(arguments, 1)));
}

function raf(func) {
  return requestAnimationFrame(func);
}

function typeOf$1(type, subject) {
  return typeof subject === type;
}

var isArray$1 = Array.isArray;
apply$1(typeOf$1, "function");
apply$1(typeOf$1, "string");
apply$1(typeOf$1, "undefined");

function toArray$1(value) {
  return isArray$1(value) ? value : [value];
}

function forEach$1(values, iteratee) {
  toArray$1(values).forEach(iteratee);
}

var ownKeys$1 = Object.keys;

function forOwn$1(object, iteratee, right) {
  if (object) {
    var keys = ownKeys$1(object);
    keys = right ? keys.reverse() : keys;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== "__proto__") {
        if (iteratee(object[key], key) === false) {
          break;
        }
      }
    }
  }

  return object;
}

function assign$1(object) {
  slice$1(arguments, 1).forEach(function (source) {
    forOwn$1(source, function (value, key) {
      object[key] = source[key];
    });
  });
  return object;
}

var min$1 = Math.min;

function EventBinder() {
  var listeners = [];

  function bind(targets, events, callback, options) {
    forEachEvent(targets, events, function (target, event, namespace) {
      var isEventTarget = ("addEventListener" in target);
      var remover = isEventTarget ? target.removeEventListener.bind(target, event, callback, options) : target["removeListener"].bind(target, callback);
      isEventTarget ? target.addEventListener(event, callback, options) : target["addListener"](callback);
      listeners.push([target, event, namespace, callback, remover]);
    });
  }

  function unbind(targets, events, callback) {
    forEachEvent(targets, events, function (target, event, namespace) {
      listeners = listeners.filter(function (listener) {
        if (listener[0] === target && listener[1] === event && listener[2] === namespace && (!callback || listener[3] === callback)) {
          listener[4]();
          return false;
        }

        return true;
      });
    });
  }

  function dispatch(target, type, detail) {
    var e;
    var bubbles = true;

    if (typeof CustomEvent === "function") {
      e = new CustomEvent(type, {
        bubbles: bubbles,
        detail: detail
      });
    } else {
      e = document.createEvent("CustomEvent");
      e.initCustomEvent(type, bubbles, false, detail);
    }

    target.dispatchEvent(e);
    return e;
  }

  function forEachEvent(targets, events, iteratee) {
    forEach$1(targets, function (target) {
      target && forEach$1(events, function (events2) {
        events2.split(" ").forEach(function (eventNS) {
          var fragment = eventNS.split(".");
          iteratee(target, fragment[0], fragment[1]);
        });
      });
    });
  }

  function destroy() {
    listeners.forEach(function (data) {
      data[4]();
    });
    empty(listeners);
  }

  return {
    bind: bind,
    unbind: unbind,
    dispatch: dispatch,
    destroy: destroy
  };
}

var EVENT_MOVE = "move";
var EVENT_MOVED = "moved";
var EVENT_UPDATED = "updated";
var EVENT_DRAG = "drag";
var EVENT_DRAGGED = "dragged";
var EVENT_SCROLL = "scroll";
var EVENT_SCROLLED = "scrolled";
var EVENT_DESTROY = "destroy";

function EventInterface(Splide2) {
  var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
  var binder = EventBinder();

  function on(events, callback) {
    binder.bind(bus, toArray$1(events).join(" "), function (e) {
      callback.apply(callback, isArray$1(e.detail) ? e.detail : []);
    });
  }

  function emit(event) {
    binder.dispatch(bus, event, slice$1(arguments, 1));
  }

  if (Splide2) {
    Splide2.event.on(EVENT_DESTROY, binder.destroy);
  }

  return assign$1(binder, {
    bus: bus,
    on: on,
    off: apply$1(binder.unbind, bus),
    emit: emit
  });
}

function RequestInterval(interval, onInterval, onUpdate, limit) {
  var now = Date.now;
  var startTime;
  var rate = 0;
  var id;
  var paused = true;
  var count = 0;

  function update() {
    if (!paused) {
      rate = interval ? min$1((now() - startTime) / interval, 1) : 1;
      onUpdate && onUpdate(rate);

      if (rate >= 1) {
        onInterval();
        startTime = now();

        if (limit && ++count >= limit) {
          return pause();
        }
      }

      raf(update);
    }
  }

  function start(resume) {
    !resume && cancel();
    startTime = now() - (resume ? rate * interval : 0);
    paused = false;
    raf(update);
  }

  function pause() {
    paused = true;
  }

  function rewind() {
    startTime = now();
    rate = 0;

    if (onUpdate) {
      onUpdate(rate);
    }
  }

  function cancel() {
    id && cancelAnimationFrame(id);
    rate = 0;
    id = 0;
    paused = true;
  }

  function set(time) {
    interval = time;
  }

  function isPaused() {
    return paused;
  }

  return {
    start: start,
    rewind: rewind,
    pause: pause,
    cancel: cancel,
    set: set,
    isPaused: isPaused
  };
}

function Throttle(func, duration) {
  var interval;

  function throttled() {
    if (!interval) {
      interval = RequestInterval(duration || 0, function () {
        func();
        interval = null;
      }, null, 1);
      interval.start();
    }
  }

  return throttled;
}

var CLASS_ACTIVE = "is-active";
var SLIDE = "slide";
var FADE = "fade";

function slice(arrayLike, start, end) {
  return Array.prototype.slice.call(arrayLike, start, end);
}

function apply(func) {
  return func.bind(null, ...slice(arguments, 1));
}

function typeOf(type, subject) {
  return typeof subject === type;
}

function isObject(subject) {
  return !isNull(subject) && typeOf("object", subject);
}

const isArray = Array.isArray;
apply(typeOf, "function");
apply(typeOf, "string");
const isUndefined = apply(typeOf, "undefined");

function isNull(subject) {
  return subject === null;
}

function toArray(value) {
  return isArray(value) ? value : [value];
}

function forEach(values, iteratee) {
  toArray(values).forEach(iteratee);
}

function toggleClass(elm, classes, add) {
  if (elm) {
    forEach(classes, name => {
      if (name) {
        elm.classList[add ? "add" : "remove"](name);
      }
    });
  }
}

const ownKeys = Object.keys;

function forOwn(object, iteratee, right) {
  if (object) {
    let keys = ownKeys(object);
    keys = right ? keys.reverse() : keys;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (key !== "__proto__") {
        if (iteratee(object[key], key) === false) {
          break;
        }
      }
    }
  }

  return object;
}

function assign(object) {
  slice(arguments, 1).forEach(source => {
    forOwn(source, (value, key) => {
      object[key] = source[key];
    });
  });
  return object;
}

function removeAttribute(elms, attrs) {
  forEach(elms, elm => {
    forEach(attrs, attr => {
      elm && elm.removeAttribute(attr);
    });
  });
}

function setAttribute(elms, attrs, value) {
  if (isObject(attrs)) {
    forOwn(attrs, (value2, name) => {
      setAttribute(elms, name, value2);
    });
  } else {
    forEach(elms, elm => {
      isNull(value) || value === "" ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
    });
  }
}

const {
  min,
  max,
  floor,
  ceil,
  abs
} = Math;

function clamp(number, x, y) {
  const minimum = min(x, y);
  const maximum = max(x, y);
  return min(max(minimum, number), maximum);
}

const DEFAULTS = {
  speed: 1,
  autoStart: true,
  pauseOnHover: true,
  pauseOnFocus: true
};
const I18N = {
  startScroll: "Start auto scroll",
  pauseScroll: "Pause auto scroll"
};

function AutoScroll(Splide2, Components2, options) {
  const {
    on,
    off,
    bind,
    unbind
  } = EventInterface(Splide2);
  const {
    translate,
    getPosition,
    toIndex,
    getLimit
  } = Components2.Move;
  const {
    setIndex,
    getIndex
  } = Components2.Controller;
  const {
    orient
  } = Components2.Direction;
  const {
    toggle
  } = Components2.Elements;
  const {
    Live
  } = Components2;
  const {
    root
  } = Splide2;
  const throttledUpdateArrows = Throttle(Components2.Arrows.update, 500);
  let autoScrollOptions = {};
  let interval;
  let stopped;
  let hovered;
  let focused;
  let busy;
  let currPosition;

  function setup() {
    const {
      autoScroll
    } = options;
    autoScrollOptions = assign({}, DEFAULTS, isObject(autoScroll) ? autoScroll : {});
  }

  function mount() {
    if (!Splide2.is(FADE)) {
      if (!interval && options.autoScroll !== false) {
        interval = RequestInterval(0, move);
        listen();
        autoStart();
      }
    }
  }

  function destroy() {
    if (interval) {
      interval.cancel();
      interval = null;
      currPosition = void 0;
      off([EVENT_MOVE, EVENT_DRAG, EVENT_SCROLL, EVENT_MOVED, EVENT_SCROLLED]);
      unbind(root, "mouseenter mouseleave focusin focusout");
      unbind(toggle, "click");
    }
  }

  function listen() {
    if (autoScrollOptions.pauseOnHover) {
      bind(root, "mouseenter mouseleave", e => {
        hovered = e.type === "mouseenter";
        autoToggle();
      });
    }

    if (autoScrollOptions.pauseOnFocus) {
      bind(root, "focusin focusout", e => {
        focused = e.type === "focusin";
        autoToggle();
      });
    }

    if (autoScrollOptions.useToggleButton) {
      bind(toggle, "click", () => {
        stopped ? play() : pause();
      });
    }

    on(EVENT_UPDATED, update);
    on([EVENT_MOVE, EVENT_DRAG, EVENT_SCROLL], () => {
      busy = true;
      pause(false);
    });
    on([EVENT_MOVED, EVENT_DRAGGED, EVENT_SCROLLED], () => {
      busy = false;
      autoToggle();
    });
  }

  function update() {
    const {
      autoScroll
    } = options;

    if (autoScroll !== false) {
      autoScrollOptions = assign({}, autoScrollOptions, isObject(autoScroll) ? autoScroll : {});
      mount();
    } else {
      destroy();
    }

    if (interval && !isUndefined(currPosition)) {
      translate(currPosition);
    }
  }

  function autoStart() {
    if (autoScrollOptions.autoStart) {
      if (document.readyState === "complete") {
        play();
      } else {
        bind(window, "load", play);
      }
    }
  }

  function play() {
    if (isPaused()) {
      interval.start(true);
      Live.disable(true);
      focused = hovered = stopped = false;
      updateButton();
    }
  }

  function pause() {
    let stop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (!stopped) {
      stopped = stop;
      updateButton();

      if (!isPaused()) {
        interval.pause();
        Live.disable(false);
      }
    }
  }

  function autoToggle() {
    if (!stopped) {
      hovered || focused || busy ? pause(false) : play();
    }
  }

  function move() {
    const position = getPosition();
    const destination = computeDestination(position);

    if (position !== destination) {
      translate(destination);
      updateIndex(currPosition = getPosition());
    } else {
      pause(false);

      if (autoScrollOptions.rewind) {
        Splide2.go(autoScrollOptions.speed > 0 ? 0 : Components2.Controller.getEnd());
      }
    }

    throttledUpdateArrows();
  }

  function computeDestination(position) {
    const speed = autoScrollOptions.speed || 1;
    position += orient(speed);

    if (Splide2.is(SLIDE)) {
      position = clamp(position, getLimit(false), getLimit(true));
    }

    return position;
  }

  function updateIndex(position) {
    const {
      length
    } = Splide2;
    const index = (toIndex(position) + length) % length;

    if (index !== getIndex()) {
      setIndex(index);
      Components2.Slides.update();
      Components2.Pagination.update();
      options.lazyLoad === "nearby" && Components2.LazyLoad.check();
    }
  }

  function updateButton() {
    if (toggle) {
      const key = stopped ? "startScroll" : "pauseScroll";
      toggleClass(toggle, CLASS_ACTIVE, !stopped);
      setAttribute(toggle, "aria-label", options.i18n[key] || I18N[key]);
    }
  }

  function isPaused() {
    return !interval || interval.isPaused();
  }

  return {
    setup,
    mount,
    destroy,
    play,
    pause,
    isPaused
  };
}

window.Splide = Splide;
window.slideshows = {};

const _createSplideInstance = (splideRoot, options, extensions) => {
  if (splideRoot.hasAttribute('data-thumbnails')) {
    const thumbsRoot = document.getElementById(splideRoot.getAttribute('data-thumbnails'));
    var thumb_option;
    if (document.getElementById(splideRoot.getAttribute('data-position')) == 'left') {
      thumb_option = {
        direction: 'ttb',
        height: 'var(--thumbnails-height)',
        autoHeight: true,
        arrows: false,
        pagination: false,
        isNavigation: true,
        focus: 'left',
        gap: '0.625rem',
        slideFocus: false
      };
    } else {
      thumb_option = {
        perPage: 4,
        perMove: 1,
        direction: 'ltr',
        arrows: false,
        pagination: false,
        isNavigation: true,
        focus: 'left',
        gap: '10px',
        slideFocus: false,
        drag: 'free',
        speed: 1000,
        breakpoints: {
          758: {
            fixedWidth: '55px'
          }
        }
      };
    }
    console.log(thumbsRoot.id)
    window.slideshows[thumbsRoot.id] = new Splide(`#${thumbsRoot.id}`, thumb_option);
    // window.slideshows[thumbsRoot.id].on('dragged', function () {
    //   console.log('dragged');
    //   return;
    // });
    // window.slideshows[thumbsRoot.id].on('moved', function () {
    //   console.log('moved');
    //   return;
    // });
    // window.slideshows[thumbsRoot.id].on('click', function () {
    //   console.log('click');
    //   return;
    // });

    window.slideshows[splideRoot.id] = new Splide(`#${splideRoot.id}`, options);
    const mainSplide = window.slideshows[splideRoot.id];
    const thumbsSplide = window.slideshows[thumbsRoot.id];
    mainSplide.sync(thumbsSplide)
    mainSplide.mount(extensions);
    document.addEventListener('shapes:product:arrow-change', e => {
      if (e.detail.direction == 'prev') {
        thumbsSplide.go('<');
      } else {
        thumbsSplide.go('>');
      }

      const slides = thumbsSplide.Components.Slides;
      const targetSlideObject = slides.getAt(thumbsSplide.index).slide.querySelector('.media-thumbnail');
      targetSlideObject.click();
    });
    document.addEventListener('shapes:product:variantchange', e => {
      if (!e.target.contains(splideRoot)) return;
      const mediaId = e.detail.variant.featured_media.id;
      const targetSlides = thumbsSplide.Components.Slides.filter(slide => slide.slide.dataset.mediaId === mediaId.toString());
      if (!targetSlides.length) return;
      thumbsSplide.go(targetSlides[0].index);
    });
    thumbsSplide.mount();
  } else {
    window.slideshows[splideRoot.id] = new Splide(`#${splideRoot.id}`, options); //make IDs unique

    window.slideshows[splideRoot.id].on('mounted', e => {
      const clones = window.slideshows[splideRoot.id].root.querySelectorAll('.splide__slide--clone');

      for (let i = 0; i < clones.length; i++) {
        let clone = clones[i];
        let elements = clone.getElementsByTagName('*');

        for (let j = 0; j < elements.length; j++) {
          let el = elements[j];

          if (el.hasAttribute('id')) {
            el.id = el.getAttribute('id') + '-' + i;
          }

          if (el.hasAttribute('for')) {
            let newForAttr = el.getAttribute('for') + '-' + i;
            el.setAttribute('for', newForAttr);
          }
        }
      }
    });

    if (splideRoot.dataset.autoRotate === 'true') {
      _setUpAutoPlay(splideRoot);
    }

    window.slideshows[splideRoot.id].mount(extensions);
  }
};

window.destroySlideshow = splideRoot => {
  window.slideshows[splideRoot.id].destroy();
  delete window.slideshows[splideRoot.id];
};

window.makeSlideshow = splideRoot => {
  if (splideRoot.matches('.splide--thumbnails')) return;

  if (!splideRoot.id) {
    console.error('Shapes Theme: makeSlideshow requires a unique ID on the slideshow root');
    return;
  }

  if (window.slideshows[splideRoot.id]) return;
  const mobileOnly = splideRoot.matches('.splide--mobile');
  let options = {
    mediaQuery: 'min',
    perPage: 1,
    perMove: 1,
    autoWidth: true,
    arrows: true,
    pagination: false,
    rewind: true,
    autoHeight: true,
    autoScroll: {
      autoStart: false
    },
    breakpoints: mobileOnly ? {
      990: {
        destroy: true
      }
    } : {}
  };
  const customOptions = splideRoot.querySelector('.slideshow-options');

  if (customOptions !== null) {
    options = JSON.parse(splideRoot.querySelector('.slideshow-options').textContent);
  }

  if (splideRoot.matches('.splide--product')) {
    
    const productOptions = {
      type: 'fade',
      perPage: 1,
      perMove: 1,
      pagination: false,
      arrows: false,
      rewind: true,
      autoHeight: true,
      drag: splideRoot.dataset.dragDisabled !== 'true',
      autoScroll: {
        autoStart: false
      }
    };
    import('./components-splide-product.bundle.js').then(_ref => {
      let {
        default: SplideProductModule,
        SplideProduct
      } = _ref;
      _createSplideInstance(splideRoot, productOptions, {
        SplideProduct
      });
    });
  } else {
    if (splideRoot.dataset.autoRotate === 'true') {
      options.drag = false;
      options.pauseOnHover = true;
      options.pauseOnFocus = true;
    }

    let extensions = {};

    if (options.autoScroll && options.autoScroll.autoStart === true && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      extensions = {
        AutoScroll
      };
    }

    _createSplideInstance(splideRoot, options, extensions);
  }
};

window.discoverNewSlideshows = function () {
  let container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  container.querySelectorAll('.splide').forEach(splideRoot => {
    makeSlideshow(splideRoot);
  });
};

window.destroySlideshowsIn = function () {
  let container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  container.querySelectorAll('.splide').forEach(splideRoot => {
    destroySlideshow(splideRoot);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  discoverNewSlideshows();
});
document.addEventListener('shapes:productquickbuy:added', () => {
  discoverNewSlideshows();
});
document.addEventListener('shapes:productquickbuy:willremove', e => {
  if (!e.detail.container) return;
  destroySlideshowsIn(e.detail.container);
});
document.addEventListener('shapes:product:mediachange', e => {
  const splideInstance = window.slideshows[e.detail.slideshow_id];
  if (!splideInstance) return;
  const slideIndex = splideInstance.Components.Elements.slides.findIndex(slide => Number(slide.dataset.mediaId) === e.detail.media_id);

  if (slideIndex > -1) {
    splideInstance.go(slideIndex);
  }
});

const _setUpAutoPlay = splideRoot => {
  const autoplayControl = splideRoot.querySelector('.splide__toggle');
  const playText = autoplayControl.dataset.play;
  const pauseText = autoplayControl.dataset.pause;
  window.slideshows[splideRoot.id].on('autoplay:play', () => {
    autoplayControl.setAttribute('aria-label', pauseText);
  });
  window.slideshows[splideRoot.id].on('autoplay:pause', event => {
    autoplayControl.setAttribute('aria-label', playText);
  });
};

function progressBar(Splide, Components, options) {
  const bar = Splide.root.querySelector('.splide__progress-bar');

  function mount() {
    if (bar) {
      Splide.on('mounted move', onMountedMove);
    }
  }

  function onMountedMove() {
    const end = Splide.Components.Controller.getEnd() + 1;
    bar.style.width = String(100 * (Splide.index + 1) / end) + '%';
  }

  return {
    mount
  };
}

export { progressBar };
