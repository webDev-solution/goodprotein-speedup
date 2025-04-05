function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function throttle(callback, limit) {
  var waiting = false; // Initially, we're not waiting
  return function () {
    // We return a throttled function
    if (!waiting) {
      // If we're not waiting
      callback.apply(this, arguments); // Execute users function
      waiting = true; // Prevent future invocations
      setTimeout(function () {
        // After a period of time
        waiting = false; // And allow future invocations
      }, limit);
    }
  };
}

/**
 * Wrapper around Object.assign that deletes null or undefined
 * keys from the provided object, making them fall back to
 * values in the defaults object.
 *
 *
 * @param {Object} defaults - An object with defaults for settings/config
 * @param {Object} provided - Provided settings/config object
 * @returns {Object} - Merged object
 */

function objectWithDefaults(defaults, provided) {
  filterObjectByValues(provided, (value) => {
    return value === null || value === undefined;
  });

  return Object.assign(defaults, provided);
}

function wrapAll(nodes, wrapper) {
  // Cache the current parent and previous sibling of the first node.
  var parent = nodes[0].parentNode;
  var previousSibling = nodes[0].previousSibling;

  // Place each node in wrapper.
  //  - If nodes is an array, we must increment the index we grab from
  //    after each loop.
  //  - If nodes is a NodeList, each node is automatically removed from
  //    the NodeList when it is removed from its parent with appendChild.
  for (var i = 0; nodes.length - i; wrapper.firstChild === nodes[0] && i++) {
    wrapper.appendChild(nodes[i]);
  }

  // Place the wrapper just after the cached previousSibling
  parent.insertBefore(wrapper, previousSibling.nextSibling);

  return wrapper;
}

function unwrap(wrapper) {
  // place childNodes in document fragment
  var docFrag = document.createDocumentFragment();
  while (wrapper.firstChild) {
    var child = wrapper.removeChild(wrapper.firstChild);
    docFrag.appendChild(child);
  }

  // replace wrapper with document fragment
  wrapper.parentNode.replaceChild(docFrag, wrapper);
}

function initTeleport(el) {
  if (!el) return;

  const teleportCandidates = el.querySelectorAll('[data-should-teleport]');

  if (teleportCandidates.length) {
    teleportCandidates.forEach((teleportCandidate) => {
      teleportCandidate.setAttribute(
        'x-teleport',
        teleportCandidate.dataset.shouldTeleport
      );
    });
  }
}

async function fetchSectionHTML(url, selector) {
  const res = await fetch(url);
  const fetchedSection = await res.text();
  const result = querySelectorInHTMLString(selector, fetchedSection);
  if (result === null) {
    return null;
  } else {
    return result.innerHTML;
  }
}

function fetchConfigDefaults(type = 'json') {
  return {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json;',
      Accept: `application/${type}`,
    },
  };
}

function parseDOMFromString(htmlString) {
  window.___shapesDOMParser = window.___shapesDOMParser || new DOMParser();

  return window.___shapesDOMParser.parseFromString(htmlString, 'text/html');
}

function querySelectorInHTMLString(selector, htmlString) {
  return parseDOMFromString(htmlString).querySelector(selector);
}

let touchDevice = false;

window.setTouch = function () {
  touchDevice = true;
};

window.isTouch = function () {
  return touchDevice;
};

function getModalLabel(modalSlotName, slotEl) {
  if (Alpine.store('modals')[modalSlotName].open) {
    const labelSourceEl = Array.from(slotEl.children).filter((el) =>
      el.hasAttribute('data-modal-label')
    )[0];

    if (labelSourceEl) {
      return labelSourceEl.dataset.modalLabel;
    }
  }

  return false;
}


/**/


/*=============== collection page js ==============*/

/*
var collNavs = document.querySelectorAll('.collection_tab_text');
var collContent = document.querySelectorAll('.collection__product_listings');

if(document.querySelectorAll('.collection_tab_text').length > 0){
  for (let i = 0; i < collNavs.length; i++) {
      collNavs[i].addEventListener("click", function(e) {
        e.preventDefault();
            var ghref = collNavs[i].getAttribute('data-href');

        for (let i = 0; i < collNavs.length; i++) {
         collNavs[i].classList.remove('collection_tab_active');
        } 
       
           for (let j = 0; j < collContent.length; j++) {
              if(ghref == 'grid_'){
                   collContent[j].classList.add('show');
                   collContent[j].style.paddingTop = '3rem';
                collContent[j].style.order = 'unset';
              }else{
                  collContent[j].classList.remove('show');
              }
          } 
       
        this.classList.add('collection_tab_active');
        if(ghref != 'grid_'){
          document.querySelector('.collection__product_listings#'+ghref).classList.add('show');
          document.querySelector('.collection__product_listings#'+ghref).style.paddingTop = '0px';
          document.querySelector('.collection__product_listings#'+ghref).style.order = '1';
          document.querySelector('.collection_between_blocks').style.order = '2';
           document.querySelector('.collections_tab').classList.remove('show');
           document.querySelector('#MainContent').classList.remove('show_coll');
        }else{
           document.querySelector('.collection__product_listings').style.paddingTop = '0px';
          document.querySelector('.collection_between_blocks').style.order = 'unset';
           document.querySelector('.collections_tab').classList.remove('show');
           document.querySelector('#MainContent').classList.remove('show_coll');
        }
        
      });
  }
}
*/

if(document.querySelectorAll('.mob_collections_tab_btn').length > 0){
 document.querySelector('.mob_collections_tab_btn').addEventListener("click", function(e) {
  var content = document.querySelector('.collections_tab');

if (content.clientHeight) {
    content.style.height = 0;
  } else {
    content.style.height = content.scrollHeight + 'px';
  }
   
    document.querySelector('.collections_tab').classList.toggle('show');
     this.classList.toggle('active_tab');
 });
}

/**/

var mydivs = document.querySelectorAll('.hover_left_content');
var righdivs =  document.querySelectorAll('.right_part_megamenu');

for (let i = 0; i < mydivs.length; i++) {
			mydivs[i].addEventListener('mouseover', () => {
				var gett_attr = mydivs[i].getAttribute('data-target');

              for(let j=0; j < righdivs.length; j++){
                   righdivs[j].style.display = 'none';
              }
               for(let j=0; j < mydivs.length; j++){
                   mydivs[j].classList.remove('hovered');
              }

              mydivs[i].classList.add('hovered');
              if(document.querySelector(".right_part_megamenu"+gett_attr)){
                document.querySelector(".right_part_megamenu"+gett_attr).style.display="flex";
              }else{
                var cols = document.getElementsByClassName('covered_shop_menu');
                for(i = 0; i < cols.length; i++) {
                  cols[i].style.backgroundColor = '#d7efff00';
                }
              }

			});

}


if(document.querySelectorAll('.ingredient_link_for_mobile_only').length > 0){
  document.querySelector('.ingredient_link_for_mobile_only').addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector('.ingredient-popup').style.display = 'block';
  });
  
  document.querySelector('.ingredient-popup .popup-modal-dismiss').addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector('.ingredient-popup').style.display = 'none';
  });
  document.querySelector('.ingredient-popup').addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector('.ingredient-popup').style.display = 'none';
  });
   document.querySelector('.ingredient__inn_popup').addEventListener("click", function(e) {
    e.stopPropagation();
  });
                           
}


