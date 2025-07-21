/* Retro-Win95 window manager */
document.addEventListener('DOMContentLoaded',()=>{
    const taskbarContainer=document.getElementById('taskbar-windows');
    let highestZ=100;           // runtime z-index tracker
  
    // activate every window already in the DOM
    document.querySelectorAll('.window,.popup-window').forEach(activateWindow);
  
    /** turn a given element into a fully featured Win-95 window */
    function activateWindow(win){
      giveDragAbility(win);
      wireButtons(win);
      bringToFront(win);
    }
  
    /* ─── dragging ─── */
    function giveDragAbility(win){
      const bar=win.querySelector('.title-bar');
      let startX=0,startY=0,dragging=false;
  
      bar.addEventListener('mousedown',e=>{
        dragging=true;bringToFront(win);
        const rect=win.getBoundingClientRect();
        startX=e.clientX-rect.left;
        startY=e.clientY-rect.top;
        e.preventDefault();
      });
      document.addEventListener('mousemove',e=>{
        if(!dragging) return;
        win.style.left=(e.clientX-startX)+'px';
        win.style.top =(e.clientY-startY)+'px';
      });
      document.addEventListener('mouseup',()=>dragging=false);
    }
  
    /* ─── control-box (_ [] X) ─── */
    function wireButtons(win){
      const [minBtn,maxBtn,closeBtn]=win.querySelectorAll('.window-buttons button');
  
      minBtn.addEventListener('click',e=>{
        e.stopPropagation();
        minimise(win);
      });
  
      maxBtn.addEventListener('click',e=>{
        e.stopPropagation();
        win.dataset.maximised==='true'?restore(win):maximise(win);
      });
  
      closeBtn.addEventListener('click',e=>{
        e.stopPropagation();
        closeWindow(win);
      });
    }
  
    /* helpers */
    function bringToFront(win){
      highestZ+=1;
      win.style.zIndex=highestZ;
    }
  
    /* minimise ⇒ hide + task-bar button */
    function minimise(win){
      const btn=document.createElement('button');
      btn.className='taskbar-window-button';
      btn.textContent=win.querySelector('.title').textContent;
      btn.addEventListener('click',()=>{ // restore on click
        win.style.display='block';
        bringToFront(win);
        btn.remove();
      });
      taskbarContainer.appendChild(btn);
      win.style.display='none';
    }
  
    /* close ⇒ remove and tidy any task-bar button */
    function closeWindow(win){
      // remove possible task-bar button
      [...taskbarContainer.children].forEach(b=>{
        if(b.textContent===win.querySelector('.title').textContent) b.remove();
      });
      win.remove();
    }
  
    /* maximise / restore */
    function maximise(win){
      win.dataset.prevRect=JSON.stringify({
        left:win.style.left,top:win.style.top,
        width:win.style.width,height:win.style.height
      });
      win.dataset.maximised='true';
      win.style.left='0'; win.style.top='0';
      win.style.width='calc(100vw - 4px)';
      win.style.height='calc(100vh - 44px)'; // leave room for borders + task-bar
      bringToFront(win);
    }
    function restore(win){
      const r=JSON.parse(win.dataset.prevRect);
      Object.assign(win.style,{left:r.left,top:r.top,width:r.width,height:r.height});
      win.dataset.maximised='false';
      bringToFront(win);
    }
  });
  