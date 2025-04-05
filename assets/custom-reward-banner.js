class RewardBannerComponent extends HTMLElement {
  constructor() {
    super();
    this.customer = this.dataset.customer;
    this.creditBallance = this.querySelector('.credit-balance');
    console.log(this.customer)
    if (this.customer == 'true') {
      var customerid = this.dataset.customerId;
      this.Login(customerid);
    }
  }

  Login(customerid) {
    var myHeaders = new Headers();
    myHeaders.append("x-rise-access-token", "TlfYoGDGk1e7nKXYDwuFxOOcIHpfGSWimZVBY7pMU2I");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`https://application.rise-ai.com/v2/gift-cards/?customer_id=${customerid}&shop_url=goodproteinca.myshopify.com`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (document.documentElement.getAttribute('lang') == 'fr') {
          var html = `
            <h3>Solde créditeur: $${result.amount}</h3>
            <p>Code de crédit: ${result.code}</p>
          `;
        } else {
          var html = `
            <h3>Credit Balance: $${result.amount}</h3>
            <p>Credit Code: ${result.code}</p>
          `;
        }
        
        this.creditBallance.innerHTML = html;
      })
      .catch(error => console.log('error', error));
  }
}

customElements.define('reward-banner-section', RewardBannerComponent);