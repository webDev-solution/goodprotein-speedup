class AccountComponent extends HTMLElement {
  constructor() {
    super();
    this.creditBallance = this.querySelector('.credit-balance');
    this.rewardBallance = this.querySelector('.reward-balance');
    this.customerid = this.dataset.customerId;
    this.customer_email = this.dataset.customerEmail;
    this.getloyalCard();
    document.addEventListener('click', this.copycode.bind(this));
  }

  copycode(evt) {
    const answer = document.getElementById("copyResult");
    const copy   = document.getElementById("copyButton");
    const selection = window.getSelection();
    const range = document.createRange();
    const textToCopy = document.getElementById("textToCopy")
    if (evt.target.closest('#copyButton')) {
      range.selectNodeContents(textToCopy);
      selection.removeAllRanges();
      selection.addRange(range);
      console.log(copy)
      const successful = document.execCommand('copy');
      if(successful){
        answer.innerHTML = 'Copied!';
      } else {
        answer.innerHTML = 'Unable to copy!';  
      }
      window.getSelection().removeAllRanges()
    }
  }

  getloyalCard() {
    var myHeaders = new Headers();
    myHeaders.append("x-rise-access-token", "TlfYoGDGk1e7nKXYDwuFxOOcIHpfGSWimZVBY7pMU2I");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`https://application.rise-ai.com/v2/gift-cards/?customer_id=${this.customerid}&shop_url=goodproteinca.myshopify.com`, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.amount = result.amount;
        if (document.documentElement.getAttribute('lang') == 'fr') {
          var credithtml = `
            <p>Crédit Cashback: $${result.amount}</p>
            <p class="small">
              Code de crédit:<div id="textToCopy">${result.code}</div>
              <button id="copyButton"><img src="https://good-protein-test.myshopify.com/cdn/shop/t/11/assets/clipboard.png"></button> 
              <span id="copyResult"></span>
            </p>
          `;
        } else {
          var credithtml = `
            <p>Cashback Credit: $${result.amount}</p>
            <div class="small">
              Credit Code:<div id="textToCopy">${result.code}</div>
              <button id="copyButton"><img src="https://good-protein-test.myshopify.com/cdn/shop/t/11/assets/clipboard.png"></button> 
              <span id="copyResult"></span>
            </div>
          `;
        }
        
        this.creditBallance.innerHTML = credithtml;

        this.getGiftCards();

      });
  }

  getGiftCards() {
    var myHeaders = new Headers();
    myHeaders.append("x-rise-access-token", "TlfYoGDGk1e7nKXYDwuFxOOcIHpfGSWimZVBY7pMU2I");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders, 
      redirect: 'follow'
    };

    fetch(`https://application.rise-ai.com/v1/gift-cards/customers/${this.customerid}?shop_url=goodproteinca.myshopify.com&customer_email=${this.customer_email}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        var totalGiftBalance = 0;
        if (document.documentElement.getAttribute('lang') == 'fr') {
          var rewardhtml = `<p class="mb-2">Solde actuel: $${this.amount}</p>`
          for (let i = 0; i < result.gift_cards.length; i++) {
            const gift = result.gift_cards[i];
            rewardhtml += `<p class="mb-2">Carte cadeau : (${gift.notified}) $${gift.balance} </p>`;
          }
          //rewardhtml +=`<p class="mb-2">Remboursement : $30 </p>`;  
        } else {
          var rewardhtml = `<p class="mb-2">Current balance: $${this.amount}</p>`
          for (let i = 0; i < result.gift_cards.length; i++) {
            const gift = result.gift_cards[i];
            rewardhtml += `<p class="mb-2">Gift card : (${gift.notified}) $${gift.balance} </p>`;
            totalGiftBalance += gift.balance;
          }
          if (document.documentElement.getAttribute('lang') == 'fr') {
          this.creditBallance.innerHTML = this.creditBallance.innerHTML + `<p class="small" >Solde de la carte cadeau: $${totalGiftBalance}</p>`
          } else {
            this.creditBallance.innerHTML = this.creditBallance.innerHTML + `<p class="small" >Gift card balance: $${totalGiftBalance}</p>`
          }
          //rewardhtml +=`<p class="mb-2">Cashback : $30 </p>`;  
        }
        
        this.rewardBallance.innerHTML = rewardhtml;
      });
  }

}

customElements.define('account-section', AccountComponent);