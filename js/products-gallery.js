(function(){
  function setProductFamily(family, shouldScroll){
    var cards=document.querySelectorAll('#product-family-list .product-card');
    cards.forEach(function(card){ card.hidden = family !== 'all' && card.getAttribute('data-family') !== family; });
    document.querySelectorAll('.product-filter').forEach(function(btn){ btn.classList.toggle('active',btn.getAttribute('data-filter')===family); });
    if(shouldScroll){
      var target=document.getElementById(family);
      if(target){ setTimeout(function(){ target.scrollIntoView({behavior:'smooth',block:'start'}); },30); }
    }
  }
  document.addEventListener('click',function(e){
    var filter=e.target.closest('.product-filter');
    if(filter){ e.preventDefault(); setProductFamily(filter.getAttribute('data-filter'),filter.getAttribute('data-filter')!=='all'); return; }
    var thumb=e.target.closest('.product-thumb');
    if(thumb){
      var media=thumb.closest('.product-media'), main=media.querySelector('.product-main-image img'), img=thumb.querySelector('img');
      if(main&&img){main.src=img.src;main.alt=img.alt;media.querySelectorAll('.product-thumb').forEach(function(t){t.classList.remove('active')});thumb.classList.add('active');}
    }
  });
  document.querySelectorAll('.gal-filter-v3 button').forEach(function(btn){
    btn.addEventListener('click',function(){
      var cat=this.getAttribute('data-cat');
      document.querySelectorAll('.gal-filter-v3 button').forEach(function(b){b.classList.toggle('active',b===btn)});
      document.querySelectorAll('.gallery-item-v3').forEach(function(item){item.hidden=cat!=='all'&&item.getAttribute('data-cat')!==cat;});
    });
  });
})();
