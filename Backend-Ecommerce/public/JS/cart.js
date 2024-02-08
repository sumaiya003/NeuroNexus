const paybtn =document.querySelector('.btn-buy');

paybtn.addEventListener('click', ()=>{
    fetch('/stripe_checkout', {
        method: 'post',
        headers: new Headers({"Content-Type" : "apppliction/Json"}),
        body: JSON.stringify({
            items: JSON.parse(localStorage.getItem("cartItems")),
        }),
    })
      .then((res) => res.json())
      .then((url) => {
        location.href = url;
      })
      .catch((err)=> console.log(err));
});