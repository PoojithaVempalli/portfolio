// Poojitha Vempalli - 3D Interactive Portfolio JavaScript
gsap.registerPlugin(ScrollToPlugin);

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = this.getInitialTheme();
        this.init();
    }

    getInitialTheme() {
        // Check localStorage first, then system preference
        const stored = localStorage.getItem('portfolio-theme');
        if (stored) return stored;
        
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    init() {
        this.applyTheme();
        this.bindEvents();
    }

    applyTheme() {
        // Set both attributes to ensure both base and custom styles update
        document.documentElement.setAttribute('data-theme', this.theme);
        document.documentElement.setAttribute('data-color-scheme', this.theme); // <-- THIS IS THE FIX

        document.body.classList.toggle('dark-mode', this.theme === 'dark');
        localStorage.setItem('portfolio-theme', this.theme);
        
        // Update background canvas colors if scene exists
        if (window.backgroundScene) {
            window.backgroundScene.updateTheme(this.theme);
        }
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        
        // Animate theme transition
        if (window.gsap) {
            gsap.to('body', {
                duration: 0.3,
                ease: 'power2.inOut'
            });
        }
    }

    bindEvents() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    }
}

// 3D Background Scene
class BackgroundScene {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas || !window.THREE) {
            console.log('Canvas or Three.js not available');
            return;
        }

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        
        this.particles = [];
        this.geometries = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.init();
        window.backgroundScene = this;
    }

    init() {
        if (!this.renderer) return;

        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        
        // Setup camera
        this.camera.position.z = 5;
        
        // Create particles
        this.createParticles();
        
        // Create floating geometries
        this.createGeometries();
        
        // Add lighting
        this.addLighting();
        
        // Start animation loop
        this.animate();
        
        // Bind events
        this.bindEvents();
    }

    createParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 500;
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;     // x
            positions[i + 1] = (Math.random() - 0.5) * 20; // y
            positions[i + 2] = (Math.random() - 0.5) * 10; // z
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x8b5cf6,
            size: 0.1,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particleSystem);
    }

    createGeometries() {
        const geometries = [
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.SphereGeometry(0.3, 16, 16),
            new THREE.ConeGeometry(0.3, 0.6, 8)
        ];

        const material = new THREE.MeshPhongMaterial({ 
            color: 0x8b5cf6, 
            transparent: true, 
            opacity: 0.3,
            wireframe: true
        });

        for (let i = 0; i < 8; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const mesh = new THREE.Mesh(geometry, material.clone());

            mesh.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 8
            );

            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                }
            };

            this.geometries.push(mesh);
            this.scene.add(mesh);
        }
    }

    addLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x8b5cf6, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    animate() {
        if (!this.renderer) return;
        
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;

        // Animate particles
        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.001;
            this.particleSystem.rotation.x += 0.0005;
        }

        // Animate geometries
        this.geometries.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;
        });

        // Mouse interaction
        this.camera.position.x += (this.mouse.x - this.camera.position.x) * 0.01;
        this.camera.position.y += (-this.mouse.y - this.camera.position.y) * 0.01;

        this.renderer.render(this.scene, this.camera);
    }

    updateTheme(theme) {
        const color = theme === 'dark' ? 0x8b5cf6 : 0x3b82f6;
        
        if (this.particleSystem) {
            this.particleSystem.material.color.setHex(color);
        }
        
        this.geometries.forEach(mesh => {
            mesh.material.color.setHex(color);
        });
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            if (!this.renderer) return;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }
}

// Smooth Scroll Manager
class SmoothScroll {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed nav
                    
                    if (window.gsap) {
                        gsap.to(window, {
                            duration: 1,
                            scrollTo: { y: offsetTop },
                            ease: 'power2.inOut'
                        });
                    } else {
                        // Fallback smooth scroll
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

// Gallery Modal Manager
class GalleryModal {
    constructor() {
        this.modal = document.getElementById('galleryModal');
        this.modalImage = document.getElementById('modalImage');
        this.currentIndex = 0;
        this.images = [];
        this.init();
    }

    init() {
        this.collectImages();
        this.bindEvents();
    }

    collectImages() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        this.images = Array.from(galleryItems).map(item => {
            const img = item.querySelector('img');
            return {
                src: img.src,
                alt: img.alt,
                title: item.querySelector('.gallery-overlay span')?.textContent || img.alt
            };
        });
    }

    open(index) {
        this.currentIndex = index;
        this.updateImage();
        this.modal.classList.remove('hidden');
        
        if (window.gsap) {
            gsap.fromTo(this.modal, 
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
        }

        document.body.style.overflow = 'hidden';
    }

    close() {
        if (window.gsap) {
            gsap.to(this.modal, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                ease: 'back.in(1.7)',
                onComplete: () => {
                    this.modal.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            });
        } else {
            this.modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
    }

updateImage() {
    const image = this.images[this.currentIndex];
    if (this.modalImage && image) {
        this.modalImage.src = image.src;
        this.modalImage.alt = image.alt;
        this.modalImage.style.objectFit = 'contain';
        this.modalImage.style.width = 'auto';
        this.modalImage.style.height = 'auto';
    }
}


    bindEvents() {
        // Gallery item clicks
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', () => this.open(index));
        });

        // Modal controls
        const closeBtn = document.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        const nextBtn = document.getElementById('modalNext');
        const prevBtn = document.getElementById('modalPrev');
        
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('hidden')) {
                switch(e.key) {
                    case 'Escape':
                        this.close();
                        break;
                    case 'ArrowRight':
                        this.next();
                        break;
                    case 'ArrowLeft':
                        this.prev();
                        break;
                }
            }
        });

        // Click outside to close
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }
    }
}

// Scroll Animations Manager
class ScrollAnimations {
    constructor() {
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.bindScrollEvents();
        // Run initial check for elements in view
        this.checkElementsInView();
    }

    bindScrollEvents() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.checkElementsInView();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
    }

    checkElementsInView() {
        const elements = document.querySelectorAll([
            '.section-title',
            '.education-card',
            '.timeline-item',
            '.skill-category',
            '.project-card',
            '.cert-badge',
            '.gallery-item:not(.animated)',
            '.contact-form'
        ].join(', '));

        elements.forEach(element => {
            if (this.animatedElements.has(element)) return;
            
            if (this.isInView(element)) {
                this.animateElement(element);
                this.animatedElements.add(element);
            }
        });
    }

    isInView(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        return rect.top < windowHeight * 0.8 && rect.bottom > 0;
    }

    animateElement(element) {
        if (!window.gsap) {
            // Fallback animation without GSAP
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            return;
        }

        if (element.classList.contains('section-title')) {
            gsap.fromTo(element,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
            );
        } else if (element.classList.contains('education-card')) {
    // Animate the card container first
    gsap.fromTo(element,
        { y: 60, opacity: 0, rotationX: -20, transformPerspective: 1000 },
        { y: 0, opacity: 1, rotationX: 0, duration: 1, ease: 'power3.out' }
    );
    
    // Then, animate the inner elements with a delay for a cascading effect
    gsap.fromTo(element.querySelectorAll('.education-header, .university, .gpa, .coursework h4'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.4, ease: 'power2.out' }
    );

    gsap.fromTo(element.querySelectorAll('.course-tag'), {
        scale: 0.5, opacity: 0
    }, {
        scale: 1, opacity: 1, stagger: 0.05, delay: 0.8, ease: 'back.out(1.7)'
    });
} else if (element.classList.contains('timeline-item')) {
            const items = Array.from(element.parentNode.children);
            const index = items.indexOf(element);
            const isEven = index % 2 === 1;
            
            gsap.fromTo(element,
                { x: isEven ? 50 : -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
            );
        } else if (element.classList.contains('skill-category')) {
            gsap.fromTo(element,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
            );
        } else if (element.classList.contains('gallery-item')) {
            element.classList.add('animated');
            const index = parseInt(element.dataset.index) || 0;
            gsap.fromTo(element,
                { scale: 0.8, opacity: 0 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    duration: 0.6, 
                    ease: 'back.out(1.7)',
                    delay: index * 0.1
                }
            );
        } else {
            // Default animation
            gsap.fromTo(element,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
            );
        }
    }
}

// Contact Form Manager
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Add focus animations to form inputs
        const inputs = this.form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (window.gsap) {
                    gsap.to(input, {
                        scale: 1.02,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });

            input.addEventListener('blur', () => {
                if (window.gsap) {
                    gsap.to(input, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    handleSubmit() {
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        button.textContent = 'Sending...';
        button.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            button.textContent = 'Message Sent! ✓';
            button.style.background = '#10b981';

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
                this.form.reset();
            }, 2000);
        }, 1000);
    }
}

// 3D Hover Effects Manager
class HoverEffects {
    constructor() {
        this.init();
    }

    init() {
        this.add3DHoverEffects();
        this.addProfileHoverEffect();
    }

    add3DHoverEffects() {
        const elements = document.querySelectorAll([
            '.floating-card',
            '.skill-category',
            '.cert-badge',
            '.timeline-content',
            '.project-card',
            '.gallery-item'
        ].join(', '));

        elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (window.gsap) {
                    gsap.to(element, {
                        y: -10,
                        rotationX: 5,
                        rotationY: 5,
                        scale: 1.05,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });

            element.addEventListener('mouseleave', () => {
                if (window.gsap) {
                    gsap.to(element, {
                        y: 0,
                        rotationX: 0,
                        rotationY: 0,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    addProfileHoverEffect() {
        const profileImage = document.querySelector('.profile-image');
        if (profileImage) {
            profileImage.addEventListener('mouseenter', () => {
                if (window.gsap) {
                    gsap.to(profileImage, {
                        scale: 1.1,
                        rotationY: 10,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });

            profileImage.addEventListener('mouseleave', () => {
                if (window.gsap) {
                    gsap.to(profileImage, {
                        scale: 1,
                        rotationY: 0,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            });
        }
    }
}

class SkillSphere {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error("SkillSphere canvas not found!");
            return;
        }
        this.skills = [
            { href: "#skills", text: "Java" }, { href: "#skills", text: "Python" },
            { href: "#skills", text: "JavaScript" }, { href: "#skills", text: "React" },
            { href: "#skills", text: "Angular" }, { href: "#skills", text: "Node.js" },
            { href: "#skills", text: "Spring Boot" }, { href: "#skills", text: "SQL" },
            { href: "#skills", text: "MongoDB" }, { href: "#skills", text: "HTML5" },
            { href: "#skills", text: "CSS" }, { href: "#skills", text: "Git" },
            { href: "#skills", text: "Docker" }, { href: "#skills", text: "AWS" },
            { href: "#skills", text: "CI/CD" }, { href: "#skills", text: "REST APIs" }
        ];
        this.init();
    }

    init() {
        // Create a list of skill links for TagCanvas to use
        const skillList = document.createElement('ul');
        skillList.id = 'skill-list-for-canvas';
        skillList.style.display = 'none'; // We hide it, TagCanvas reads it

        this.skills.forEach(skill => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = skill.href;
            link.textContent = skill.text;
            listItem.appendChild(link);
            skillList.appendChild(listItem);
        });

        this.canvas.parentElement.appendChild(skillList);
        this.startCanvas();
    }

    startCanvas() {
        try {
            TagCanvas.Start('skill-canvas', 'skill-list-for-canvas', {
                textColour: '#8b5cf6', // Use your accent purple color
                outlineColour: 'transparent',
                reverse: true,
                depth: 0.8,
                maxSpeed: 0.05,
                initial: [0.05, -0.05],
                wheelZoom: false,
                textHeight: 18,
                textFont: '"FKGroteskNeue", "Geist", sans-serif',
                weight: true,
                weightMode: 'bold',
            });
        } catch (e) {
            // If the canvas is not visible, hide the container
            console.error("TagCanvas failed to start:", e);
            if (this.canvas.parentElement) {
                this.canvas.parentElement.style.display = 'none';
            }
        }

        // Make it responsive
        TagCanvas.Resize('skill-canvas');
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.init();
    }

    init() {
        if (this.nav) {
            this.bindScrollEffect();
        }
    }

        bindScrollEffect() {
            let ticking = false;

            const updateNav = () => {
                const currentScrollY = window.scrollY;
                
                
                this.nav.classList.toggle('nav--scrolled', currentScrollY > 100);

                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateNav);
                    ticking = true;
                }
            });

            updateNav();
        }

}

// Main Application
class PortfolioApp {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Initialize immediately for faster loading
        this.initializeComponents();
        this.setupHeroInteraction();
        // Run entrance animations after DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.setupInitialAnimations(), 100);
            });
        } else {
            setTimeout(() => this.setupInitialAnimations(), 100);
        }
    }

    initializeComponents() {
        try {
            this.components.themeManager = new ThemeManager();
            this.components.smoothScroll = new SmoothScroll();
            this.components.galleryModal = new GalleryModal();
            this.components.scrollAnimations = new ScrollAnimations();
            this.components.contactForm = new ContactForm();
            this.components.hoverEffects = new HoverEffects();
            this.components.navigationManager = new NavigationManager();
            this.components.skillSphere = new SkillSphere('skill-canvas');

            // Initialize 3D scene if Three.js is available
            if (window.THREE) {
                this.components.backgroundScene = new BackgroundScene();
            }
        } catch (error) {
            console.log('Some components failed to initialize:', error);
        }
    }
 setupHeroInteraction() {
        if (!window.gsap) return;

        const heroSection = document.getElementById('hero');
        const heroContent = document.querySelector('.hero-content');

        if (!heroSection || !heroContent) return;

        heroSection.addEventListener('mousemove', (e) => {
            const { offsetWidth: width, offsetHeight: height } = heroSection;
            const { clientX: x, clientY: y } = e;

            const rotateX = (y / height - 0.5) * -15; // Max rotation 7.5 deg
            const rotateY = (x / width - 0.5) * 15;  // Max rotation 7.5 deg

            gsap.to(heroContent, {
                duration: 0.8,
                rotationX: rotateX,
                rotationY: rotateY,
                ease: 'power2.out'
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            gsap.to(heroContent, {
                duration: 1,
                rotationX: 0,
                rotationY: 0,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    }

    setupInitialAnimations() {
        if (!window.gsap) return;

        // Hero section entrance animation
        const tl = gsap.timeline();
        
        tl.from('.profile-image', {
            scale: 0,
            rotation: 180,
            duration: 1,
            ease: 'back.out(1.7)'
        })
        .from('.hero-title', {
            y: 100,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.5')
        .from('.hero-subtitle', {
            y: 50,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.3')
        

        // Floating elements continuous animation
        gsap.to('.floating-card', {
            y: -20,
            duration: 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            stagger: {
                amount: 0.5,
                from: 'random'
            }
        });

        document.querySelectorAll('.floating-card').forEach(card => {
    gsap.to(card, {
        x: "random(-15, 15, 5)", // Random horizontal movement
        y: "random(-20, 20, 5)", // Random vertical movement
        rotation: "random(-10, 10, 2)", // Random rotation
        duration: "random(3, 5)",
        ease: 'none',
        repeat: -1,
        yoyo: true,
        delay: "random(0, 2)"
    });
});
    }
}

// Initialize the application
const app = new PortfolioApp();