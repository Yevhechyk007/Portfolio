if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
 const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold: .1});
 document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
 document.documentElement.classList.add('reveal-ready');
}
