document.addEventListener('DOMContentLoaded', () => {

    async function loadPartials() {
        const partials = [
            { id: 'age-gate-container', url: 'partials/age-gate.html' },
            { id: 'header-container', url: 'partials/header.html' },
            { id: 'hero-container', url: 'partials/hero.html' },
            { id: 'explore-collection-container', url: 'partials/explore-collection.html' },
            { id: 'flower-container', url: 'partials/flower.html' },
            { id: 'pre-rolls-container', url: 'partials/pre-rolls.html' },
            { id: 'vapes-container', url: 'partials/vapes.html' },
            { id: 'featured-container', url: 'partials/featured.html' },
            { id: 'about-story-container', url: 'partials/about-story.html' },
            { id: 'find-us-container', url: 'partials/find-us.html' },
            { id: 'footer-container', url: 'partials/footer.html' },
        ];

        for (const partial of partials) {
            try {
                const response = await fetch(partial.url);
                const text = await response.text();
                const container = document.getElementById(partial.id);
                if (container) {
                    container.innerHTML = text;
                } else {
                    console.error(`Container not found for ${partial.id}`);
                }
            } catch (error) {
                console.error(`Error loading partial ${partial.url}:`, error);
            }
        }
    }

    function initializeSite() {
        const ageGate = document.getElementById('age-gate');
        const ageForm = document.getElementById('age-form');
        const mainContent = document.getElementById('main-content');
        const ageError = document.getElementById('age-error');

        // This check prevents re-initializing if partials haven't loaded yet.
        if (!ageGate || !ageForm) {
            console.log("Age gate not ready, skipping init.");
            return;
        }

        const mainSections = document.querySelectorAll('main > div > section:not(#product-detail)');
        const productDetailSection = document.getElementById('product-detail');
        
        ageForm.addEventListener('submit', (event) => {
            event.preventDefault();
    
            const monthInput = document.getElementById('month');
            const dayInput = document.getElementById('day');
            const yearInput = document.getElementById('year');
            
            const month = parseInt(monthInput.value);
            const day = parseInt(dayInput.value);
            const year = parseInt(yearInput.value);
    
            if (isNaN(month) || isNaN(day) || isNaN(year) || month < 1 || month > 12 || day < 1 || day > 31 || year < 1900) {
                ageError.textContent = 'Please enter a valid date.';
                return;
            }
    
            const birthDate = new Date(year, month - 1, day);
            const today = new Date();
            
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
    
            if (age >= 21) {
                ageGate.style.display = 'none';
                mainContent.classList.remove('hidden');
                initGrowthAnimation();
                initStoreLocator();
            } else {
                ageError.textContent = 'Sorry, you must be 21 or older to enter.';
            }
        });

        function renderPayPalButton(product) {
            const paypalContainer = document.getElementById('paypal-button-container');
            if (!paypalContainer) return;
            paypalContainer.innerHTML = ''; // Clear previous button if any

            const price = product.price.replace('$', '');

            paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            description: product.name,
                            amount: {
                                currency_code: 'USD',
                                value: price
                            },
                            payee: {
                                email_address: 'eduardoroblesespinosa@hotmail.com'
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        alert('Transaction completed successfully! Thank you, ' + details.payer.name.given_name + '.');
                    });
                },
                onError: function(err) {
                    console.error('PayPal Checkout Error:', err);
                    alert('An error occurred with your payment. Please try again.');
                }
            }).render('#paypal-button-container');
        }

        function showProductDetail(productId) {
            const product = products.find(p => p.id === parseInt(productId));
            if (!product) return;
    
            productDetailSection.innerHTML = `
                <div class="product-detail-content">
                    <button id="back-to-shop">← Back to Shop</button>
                    <div class="product-layout">
                        <div class="product-detail-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-detail-info">
                            <h2>${product.name}</h2>
                            <p class="product-price">${product.price}</p>
                            <p>${product.longDesc}</p>
                            <div id="paypal-button-container"></div>
                        </div>
                    </div>
                </div>
            `;
    
            document.querySelectorAll('main > div > section').forEach(section => section.classList.add('hidden'));
            productDetailSection.classList.remove('hidden');
            window.scrollTo(0, 0);

            renderPayPalButton(product);
    
            document.getElementById('back-to-shop').addEventListener('click', () => {
                document.querySelectorAll('main > div > section').forEach(section => section.classList.remove('hidden'));
                productDetailSection.classList.add('hidden');
            });
        }
    
        const viewProductButtons = document.querySelectorAll('.view-product-btn');
        viewProductButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.currentTarget.dataset.productId;
                showProductDetail(productId);
            });
        });

        // Check if user already passed age gate (e.g. page refresh)
        // In a real app, this would use a cookie or session storage.
        if (sessionStorage.getItem('ageVerified') === 'true') {
            if (ageGate) ageGate.style.display = 'none';
            if (mainContent) mainContent.classList.remove('hidden');
            initGrowthAnimation();
            initStoreLocator();
        }

        // "Shop Now" button in hero section
        const heroShopNowBtn = document.getElementById('hero-shop-now-btn');
        if (heroShopNowBtn) {
            heroShopNowBtn.addEventListener('click', () => {
                const flowerSection = document.getElementById('flower');
                if (flowerSection) {
                    flowerSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // "Explore The Collection" button in featured section
        const exploreCollectionBtn = document.getElementById('explore-collection-btn');
        if (exploreCollectionBtn) {
            exploreCollectionBtn.addEventListener('click', () => {
                const exploreSection = document.getElementById('explore-collection');
                if (exploreSection) {
                    exploreSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Header scroll effect
        const header = document.querySelector('header');
        if(header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    }

    const products = [
        { id: 1, name: 'Lowell Eighth - Sativa', image: 'product-flower-sativa.png', price: '$45', shortDesc: 'An uplifting and energetic sativa strain.', longDesc: 'Our sun-grown Sativa flower is perfect for daytime use. Experience a burst of creativity and energy with this premium, all-natural cannabis. Grown pesticide-free in California.' },
        { id: 2, name: 'Lowell Eighth - Indica', image: 'product-flower-indica.png', price: '$45', shortDesc: 'A relaxing and calming indica strain.', longDesc: 'Cultivated for relaxation, our Indica flower helps soothe the mind and body. Ideal for evening use, this strain offers a peaceful and calming experience. All-natural and sun-grown.' },
        { id: 3, name: 'Lowell Quarter - Hybrid', image: 'product-flower-hybrid.png', price: '$80', shortDesc: 'A balanced hybrid for any time of day.', longDesc: 'Get the best of both worlds with our Hybrid flower. This balanced strain provides a gentle lift in mood followed by a wave of relaxation, making it suitable for any time of day.' },
        { id: 4, name: 'The Social Sativa Pack', image: 'product-preroll-sativa.png', price: '$40', shortDesc: 'Perfect for conversation and creativity.', longDesc: 'Our Social Sativa pre-rolls are crafted to inspire creativity and lively conversation. Each joint is packed with our finest sun-grown Sativa for a consistent, uplifting experience.' },
        { id: 5, name: 'The Creative Hybrid Pack', image: 'product-preroll-hybrid.png', price: '$40', shortDesc: 'Spark inspiration with this hybrid blend.', longDesc: 'This balanced hybrid blend is designed to spark inspiration and focus. Perfect for artists, writers, or anyone looking for a creative boost. Conveniently pre-rolled for your enjoyment.' },
        { id: 6, name: 'The Calming Indica Pack', image: 'product-preroll-indica.png', price: '$40', shortDesc: 'Unwind and de-stress with this indica pack.', longDesc: 'Let go of the day\'s stress with our Calming Indica pre-rolls. Each joint is filled with premium indica flower, perfect for deep relaxation and a restful night\'s sleep.' },
        { id: 7, name: 'The 35\'s Tall Pre-rolls', image: 'product-preroll-35s.png', price: '$35', shortDesc: 'A full-flavor experience in a convenient size.', longDesc: 'The 35\'s offer a full-flavor experience in a conveniently sized pre-roll. A perfectly balanced hybrid, these are ideal for any time, day or night. Comes in a pack of 10.' },
        { id: 8, name: 'Live Rosin Disposable Vape - Sativa', image: 'product-vape-sativa.png', price: '$60', shortDesc: 'Uplifting sativa live rosin disposable vape.', longDesc: 'Experience the pure, potent flavor of our Sativa live rosin in a discreet disposable vape. This solventless extract provides an energetic and uplifting effect, perfect for on-the-go.' },
        { id: 9, name: 'Live Rosin Disposable Vape - Indica', image: 'product-vape-indica.png', price: '$60', shortDesc: 'Relaxing indica live rosin disposable vape.', longDesc: 'Unwind anywhere with our Indica live rosin disposable vape. This all-natural, solventless extract delivers a calming and relaxing effect to help you de-stress and find your peace.' },
        { id: 10, name: 'Hash Rosin Disposable Vape - Hybrid', image: 'product-vape-hybrid.png', price: '$65', shortDesc: 'Balanced hybrid hash rosin disposable vape.', longDesc: 'Our premium Hash Rosin vape offers a balanced hybrid experience. Made from the finest ice-water hash, this vape provides a rich flavor profile and a perfectly moderated effect.' },
        { id: 11, name: 'Live Rosin Vape - Lemon Haze', image: 'product-vape-sativa.png', price: '$60', shortDesc: 'A zesty and uplifting sativa experience.', longDesc: 'Our Lemon Haze Sativa vape offers a burst of citrus flavor and an energetic, uplifting high. Perfect for creative pursuits and social gatherings, this live rosin is pure and potent.' },
        { id: 12, name: 'Live Rosin Vape - Blue Dream', image: 'product-vape-hybrid.png', price: '$60', shortDesc: 'A balanced and euphoric hybrid favorite.', longDesc: 'A legendary cross, Blue Dream balances full-body relaxation with gentle cerebral invigoration. This live rosin vape captures its sweet berry aroma and delivers a consistently smooth experience.' },
        { id: 13, name: 'Live Rosin Vape - GDP', image: 'product-vape-indica.png', price: '$60', shortDesc: 'A deeply relaxing and classic indica vape.', longDesc: 'Granddaddy Purple (GDP) is a famous indica known for its deep relaxation effects. This live rosin vape delivers a complex grape and berry aroma, perfect for unwinding at the end of the day.' },
        { id: 14, name: 'Hash Rosin Vape - Sour Diesel', image: 'product-vape-sativa.png', price: '$65', shortDesc: 'An energizing and pungent sativa hash vape.', longDesc: 'Experience the legendary Sour Diesel in a premium hash rosin format. Known for its pungent, diesel-like aroma, this sativa vape delivers fast-acting, energizing, and dreamy cerebral effects.' },
        { id: 15, name: 'Hash Rosin Vape - OG Kush', image: 'product-vape-hybrid.png', price: '$65', shortDesc: 'The legendary balanced OG Kush hybrid.', longDesc: 'A true classic, our OG Kush hash rosin vape provides the ultimate balanced high. With notes of fuel, skunk, and spice, it delivers a happy, hungry, and relaxed state of mind.' },
        { id: 16, name: 'Hash Rosin Vape - N. Lights', image: 'product-vape-indica.png', price: '$65', shortDesc: 'A soothing and dreamy indica hash vape.', longDesc: 'Northern Lights is a pure indica prized for its resinous buds and fast flowering. This hash rosin vape creates a comfortable laziness, relaxing muscles and pacifying the mind in dreamy euphoria.' },
        { id: 17, name: 'Melted Diamonds - Tropicana', image: 'product-vape-sativa.png', price: '$70', shortDesc: 'A potent and flavorful tropical sativa.', longDesc: 'Our Melted Diamonds vape is the pinnacle of potency. Tropicana Cookies delivers a cerebral, focused high with a burst of citrus notes, perfect for a sunny afternoon.' },
        { id: 18, name: 'Melted Diamonds - Gelato', image: 'product-vape-hybrid.png', price: '$70', shortDesc: 'A creamy and powerful dessert-like hybrid.', longDesc: 'A potent and flavorful hybrid, Gelato offers a euphoric high accompanied by strong feelings of relaxation. This Melted Diamonds vape has a sweet, dessert-like flavor profile.' },
        { id: 19, name: 'Melted Diamonds - Wedding Cake', image: 'product-vape-indica.png', price: '$70', shortDesc: 'A rich and tranquil indica for relaxation.', longDesc: 'Wedding Cake is a relaxing and euphoric indica-dominant hybrid. Our Melted Diamonds capture its tangy, sweet earth and pepper notes, providing a calming experience for body and mind.' },
        { id: 20, name: 'CBD Disposable Vape - Calm', image: 'product-vape-hybrid.png', price: '$55', shortDesc: 'A balanced CBD/THC blend for calmness.', longDesc: 'Find your center with our Calm vape. This carefully crafted 1:1 CBD to THC blend provides gentle relaxation without a strong psychoactive effect, ideal for daytime relief and focus.' }
    ];

    const stores = [
        { name: 'The Green Cross', address: '4218 Mission St, San Francisco, CA 94112', phone: '(415) 648-4420' },
        { name: 'SPARC on Haight', address: '1580 Haight St, San Francisco, CA 94117', phone: '(415) 805-1085' },
        { name: 'MedMen - Los Angeles', address: '8208 Santa Monica Blvd, West Hollywood, CA 90046', phone: '(323) 848-7981' },
        { name: 'Cookies Melrose', address: '8360 Melrose Ave #101, Los Angeles, CA 90069', phone: '(323) 433-4743' },
        { name: 'Urbn Leaf - San Diego', address: '1028 Buenos Ave, San Diego, CA 92110', phone: '(619) 275-2235' },
        { name: 'Golden State Canna', address: '2235 E 7th St, Long Beach, CA 90804', phone: '(562) 283-3383' },
        { name: 'Harborside - Oakland', address: '1840 Embarcadero, Oakland, CA 94606', phone: '(888) 994-2726' },
        { name: 'Atrium - Sacramento', address: '1900 19th St, Sacramento, CA 95811', phone: '(916) 706-0336' }
    ];

    function initGrowthAnimation() {
        const growthStages = document.querySelectorAll('.growth-stage');
        const plantImages = document.querySelectorAll('.plant-image');

        if (!growthStages.length || !plantImages.length) return;

        let activeStage = 1;
        document.querySelector(`.plant-image[data-stage="1"]`).classList.add('active');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stage = entry.target.dataset.stage;
                    if (stage !== activeStage) {
                        activeStage = stage;
                        plantImages.forEach(img => {
                            if (img.dataset.stage === stage) {
                                img.classList.add('active');
                            } else {
                                img.classList.remove('active');
                            }
                        });
                    }
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of the element is visible

        growthStages.forEach(stage => {
            observer.observe(stage);
        });
    }

    function initStoreLocator() {
        const storeList = document.getElementById('store-list');
        const searchInput = document.getElementById('location-search');
        const searchBtn = document.getElementById('search-btn');

        if (!storeList) return;

        function renderStores(storeData) {
            storeList.innerHTML = '';
            if (storeData.length === 0) {
                storeList.innerHTML = '<li><p>No stores found matching your search.</p></li>';
                return;
            }
            storeData.forEach(store => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h4>${store.name}</h4>
                    <p>${store.address}</p>
                    <a href="tel:${store.phone}">${store.phone}</a>
                `;
                storeList.appendChild(li);
            });
        }

        function filterStores() {
            const query = searchInput.value.toLowerCase();
            const filteredStores = stores.filter(store => 
                store.name.toLowerCase().includes(query) ||
                store.address.toLowerCase().includes(query)
            );
            renderStores(filteredStores);
        }
        
        searchBtn.addEventListener('click', filterStores);
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                filterStores();
            }
        });


        // Initial render
        renderStores(stores);
    }
    
    loadPartials().then(() => {
        // Now that the HTML is loaded, we can initialize the scripts
        // that depend on the DOM elements.
        initializeSite();
    });
});