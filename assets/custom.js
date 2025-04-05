var modal = document.querySelector(".modal");
var closeButton = document.querySelector(".close-button");

function toggleModal() {
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
  if (event.target === modal) {
      toggleModal();
  }
}

if (window.location.href.indexOf('loop_subscriptions') > -1) {
  window.addEventListener("DOMContentLoaded", (event) => {
    var interval = setInterval(() => {
      if (document.querySelectorAll('#loop-cp-subscription-detail-order-actions #loop-order-card-delay-btn').length > 0) {
        clearInterval(interval)
        setTimeout(() => {
          document.querySelectorAll('#loop-cp-subscription-detail-order-actions #loop-order-card-delay-btn').forEach(element => {
            const button = document.createElement('button');
            button.className = "loop-btn loop-btn-outline loop-btn-size-lg loop-btn-order mx-2"; 
            button.id= "loop-order-card-upsell-btn"
            button.innerHTML = "Add products"
            element.parentNode.appendChild(button)
            button.addEventListener('click', function (e) {
              e.preventDefault();
              console.log("asdfasdfasdfasdf")
              document.querySelector('.loop-upsell-view-more-btn').click();
            })
          });
          document.querySelector('#manage-subscription-plan a').addEventListener('click', function (e) {
            e.preventDefault();
            toggleModal();
          })

          document.querySelector('#manage-plan-modal #reschedule-btn').addEventListener('click', function (e) {
            e.preventDefault();
            toggleModal();
            document.querySelector('#loop-order-card-delay-btn').click();
          })

          document.querySelector('#manage-plan-modal #pause-btn').addEventListener('click', function (e) {
            e.preventDefault();
            toggleModal();
            document.querySelector('#loop-pause-btn').click();
          })

          document.querySelector('#manage-plan-modal #cancel-btn').addEventListener('click', function (e) {
            e.preventDefault();
            toggleModal();
            document.querySelector('#loop-cancel-btn').click();
          })

          closeButton.addEventListener("click", toggleModal);
          window.addEventListener("click", windowOnClick);
        }, 500);
        
      }
    }, 500);
  });
  
}






