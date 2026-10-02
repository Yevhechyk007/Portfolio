const links = document.getElementById('navLinks');
const button = document.getElementById('menuBtn');
if (links && button) {
 const setOpen = open => { links.classList.toggle('open',open); button.classList.toggle('active',open); button.setAttribute('aria-expanded',String(open)); };
 button.addEventListener('click',()=>setOpen(!links.classList.contains('open')));
 links.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setOpen(false)));
 document.addEventListener('keydown',event=>{if(event.key==='Escape')setOpen(false);});
}
