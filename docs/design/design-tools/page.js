(function(){
  function fitAll(){document.querySelectorAll('.fit').forEach(function(f){var w=+f.dataset.w,m=f.firstElementChild;if(!w||!m)return;m.style.transform='scale('+(f.clientWidth/w)+')';});}
  fitAll(); window.addEventListener('resize',fitAll); if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitAll);
})();
