(function(){
  var d=document.getElementById('lb'), im=document.getElementById('lbimg'), cap=document.getElementById('lbcap');
  document.addEventListener('click',function(e){
    var b=e.target.closest('.zoom'); if(!b||!d.showModal) return;
    im.src=b.dataset.src; im.alt=b.dataset.cap; cap.textContent=b.dataset.cap+' · tap the picture to switch between fit and full size'; im.className='fit'; d.showModal();
  });
  im.addEventListener('click',function(){ im.className=im.className==='fit'?'':'fit'; });
  d.addEventListener('click',function(e){ if(e.target===d) d.close(); });
})();
