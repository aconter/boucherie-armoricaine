function toggleMenu() {
            document.getElementById('nav').classList.toggle('active');
            document.getElementById('menuToggle').classList.toggle('active');
            document.getElementById('menuOverlay').classList.toggle('active');
            document.body.style.overflow = document.getElementById('nav').classList.contains('active') ? 'hidden' : '';
        }
        function closeMenu() {
            document.getElementById('nav').classList.remove('active');
            document.getElementById('menuToggle').classList.remove('active');
            document.getElementById('menuOverlay').classList.remove('active');
            document.body.style.overflow = '';
        }

        (function () {
            var bubble = document.getElementById('contact-bubble');
            var form = document.getElementById('contact-form');
            var closeBtn = document.getElementById('close-form');
            if(!bubble || !form || !closeBtn) return;
            function toggle(open){
                var isOpen = typeof open === 'boolean' ? open : form.style.display !== 'block';
                form.style.display = isOpen ? 'block' : 'none';
                bubble.setAttribute('aria-expanded', String(isOpen));
            }
            bubble.addEventListener('click', function(){ toggle(true); });
            closeBtn.addEventListener('click', function(){ toggle(false); });
            document.addEventListener('click', function(e){
                if(!form.contains(e.target) && e.target !== bubble && !bubble.contains(e.target)){ toggle(false); }
            });
        })();

        (function() {
            const observerOptions = { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 };
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
                });
            }, observerOptions);
            document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale').forEach(function(el) { observer.observe(el); });
            document.querySelectorAll('.service-tag').forEach(function(tag, index) { tag.style.transitionDelay = (index * 0.1) + 's'; });
            document.querySelectorAll('.tarif-card').forEach(function(card, index) { card.style.transitionDelay = (index * 0.12) + 's'; });
            document.querySelectorAll('.contact-item').forEach(function(item, index) { item.style.transitionDelay = (index * 0.1) + 's'; });
        })();

        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                var target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    var headerHeight = document.querySelector('.header').offsetHeight;
                    window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - headerHeight, behavior: 'smooth' });
                }
            });
        });
