// ========================================
// MAIN.JS - Menu Interactions
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ---- Category Filtering ----
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuCategories = document.querySelectorAll('.menu-category');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;

            menuCategories.forEach(cat => {
                if (category === 'all' || cat.dataset.category === category) {
                    cat.style.display = 'block';
                    cat.style.animation = 'none';
                    // Trigger reflow
                    void cat.offsetHeight;
                    cat.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    cat.style.display = 'none';
                }
            });
        });
    });

    // ---- Menu Card Click - Add to Cart Animation ----
    const addButtons = document.querySelectorAll('.menu-card-add');
    
    addButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Get item details
            const card = this.closest('.menu-card');
            const name = card.dataset.name || card.querySelector('.menu-card-name').textContent;
            const price = card.dataset.price || card.querySelector('.menu-card-price').textContent;
            
            // Button feedback animation
            this.innerHTML = '✓';
            this.style.background = '#2C241E';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fa-solid fa-plus"></i>';
                this.style.background = '';
            }, 1200);

            // Log for now (replace with actual cart logic)
            console.log(`Added ${name} - ${price} to cart`);
        });
    });

    // ---- Menu Card Click - Open Detail Modal ----
    const menuCards = document.querySelectorAll('.menu-card');
    
    menuCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the add button
            if (e.target.closest('.menu-card-add')) return;
            
            const name = this.dataset.name || this.querySelector('.menu-card-name').textContent;
            const price = this.dataset.price || this.querySelector('.menu-card-price').textContent;
            const desc = this.querySelector('.menu-card-desc')?.textContent || '';
            const img = this.querySelector('.menu-card-image img')?.src || '';
            
            // Open modal with item details
            openModal(name, price, desc, img);
        });
    });

    // ---- Modal System ----
    function openModal(name, price, desc, img) {
        // Create modal if it doesn't exist
        let modal = document.querySelector('.menu-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'menu-modal';
            modal.innerHTML = `
                <div class="menu-modal-overlay"></div>
                <div class="menu-modal-content">
                    <button class="menu-modal-close"><i class="fa-solid fa-xmark"></i></button>
                    <div class="menu-modal-image">
                        <img src="" alt="Item image" />
                    </div>
                    <div class="menu-modal-info">
                        <h2 class="menu-modal-name"></h2>
                        <p class="menu-modal-desc"></p>
                        <div class="menu-modal-footer">
                            <span class="menu-modal-price"></span>
                            <button class="menu-modal-add">Add to Order</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close modal on overlay click
            modal.querySelector('.menu-modal-overlay').addEventListener('click', closeModal);
            modal.querySelector('.menu-modal-close').addEventListener('click', closeModal);
            
            // Close modal on ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closeModal();
            });

            // Add to cart from modal
            modal.querySelector('.menu-modal-add').addEventListener('click', function() {
                const name = modal.querySelector('.menu-modal-name').textContent;
                const price = modal.querySelector('.menu-modal-price').textContent;
                console.log(`Added ${name} - ${price} to cart from modal`);
                // Animation feedback
                this.textContent = '✓ Added!';
                this.style.background = '#2C241E';
                setTimeout(() => {
                    this.textContent = 'Add to Order';
                    this.style.background = '';
                }, 1500);
            });
        }

        // Fill modal with data
        modal.querySelector('.menu-modal-image img').src = img;
        modal.querySelector('.menu-modal-name').textContent = name;
        modal.querySelector('.menu-modal-desc').textContent = desc;
        modal.querySelector('.menu-modal-price').textContent = price;

        // Show modal with animation
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = document.querySelector('.menu-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ---- Surprise Me Button ----
    const surpriseBtn = document.querySelector('.cta-btn');
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', function() {
            const items = document.querySelectorAll('.menu-card');
            const random = items[Math.floor(Math.random() * items.length)];
            
            if (random) {
                // Scroll to the item
                random.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Highlight it
                random.style.transition = 'all 0.3s ease';
                random.style.boxShadow = '0 0 0 4px var(--dark-charcoal), 0 12px 40px rgba(26,20,16,0.2)';
                random.style.transform = 'scale(1.02)';
                
                setTimeout(() => {
                    random.style.boxShadow = '';
                    random.style.transform = '';
                }, 2000);

                // Show a quick notification
                const name = random.querySelector('.menu-card-name').textContent;
                alert(`☕ Today's surprise: ${name}!`);
            }
        });
    }

    // ---- Smooth Category Scroll ----
    // When clicking category buttons, smoothly scroll to the section
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            if (category === 'all') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const target = document.querySelector(`.menu-category[data-category="${category}"]`);
            if (target) {
                const offset = 100;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

});