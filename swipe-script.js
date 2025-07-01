// Photo collection with mix of aesthetic and ugly photos
const photoCollection = [
    // Beautiful aesthetic photos
    {
        url: 'https://evalstate-flux1-schnell.hf.space/gradio_api/file=/tmp/gradio/827ec1836ee747bc679a79ab2e221a1886170d4654549b3d565e41311b3468db/image.webp',
        quality: 95,
        category: 'Mountain Sunset',
        duplicates: 0,
        isAesthetic: true
    },
    {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
        quality: 88,
        category: 'Landscape',
        duplicates: 0,
        isAesthetic: true
    },
    {
        url: 'https://evalstate-flux1-schnell.hf.space/gradio_api/file=/tmp/gradio/33d1dcd54a62cabff355cc5c2196fcfa4e6f80da0743fe197dab4deabdfaa752/image.webp',
        quality: 85,
        category: 'Night Street',
        duplicates: 0,
        isAesthetic: true
    },
    {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
        quality: 90,
        category: 'Nature',
        duplicates: 0,
        isAesthetic: true
    },
    // Ugly/low quality photos
    {
        url: 'https://evalstate-flux1-schnell.hf.space/gradio_api/file=/tmp/gradio/b04db69dfb8f2045beebee0e92dd98f1bf1df0afc548cabe65033369eece0b4a/image.webp',
        quality: 20,
        category: 'Blurry Room',
        duplicates: 2,
        isAesthetic: false
    },
    {
        url: 'https://evalstate-flux1-schnell.hf.space/gradio_api/file=/tmp/gradio/6f29d23c8587aa964b795bc9168690cd7e6b6a985a3c2fc28d6ee4f91d83e543/image.webp',
        quality: 45,
        category: 'Selfie',
        duplicates: 0,
        isAesthetic: false
    },
    {
        url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=600&fit=crop',
        quality: 25,
        category: 'Motion Blur',
        duplicates: 2,
        isAesthetic: false
    },
    {
        url: 'https://images.unsplash.com/photo-1607344645866-009c7d0f2e8d?w=400&h=600&fit=crop',
        quality: 30,
        category: 'Dark Photo',
        duplicates: 0,
        isAesthetic: false
    },
    // More aesthetic photos
    {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop',
        quality: 92,
        category: 'Ocean View',
        duplicates: 0,
        isAesthetic: true
    },
    {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
        quality: 87,
        category: 'Mountain',
        duplicates: 0,
        isAesthetic: true
    },
    // More ugly photos
    {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
        quality: 15,
        category: 'Overexposed',
        duplicates: 3,
        isAesthetic: false
    },
    {
        url: 'https://images.unsplash.com/photo-1607344645866-009c7d0f2e8d?w=400&h=600&fit=crop',
        quality: 18,
        category: 'Poor Light',
        duplicates: 1,
        isAesthetic: false
    },
    // Final good photos
    {
        url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=600&fit=crop',
        quality: 94,
        category: 'Golden Hour',
        duplicates: 0,
        isAesthetic: true
    },
    {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
        quality: 89,
        category: 'Forest Path',
        duplicates: 0,
        isAesthetic: true
    },
    // Additional variety
    {
        url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=600&fit=crop',
        quality: 12,
        category: 'Terrible Blur',
        duplicates: 4,
        isAesthetic: false
    },
    {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop',
        quality: 91,
        category: 'Seascape',
        duplicates: 0,
        isAesthetic: true
    }
];

// App state
let currentPhotoIndex = 0;
let stats = {
    kept: 0,
    deleted: 0,
    favorited: 0
};

let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;

// DOM elements
const photoStack = document.getElementById('photoStack');
const loadingScreen = document.getElementById('loadingScreen');
const completionScreen = document.getElementById('completionScreen');
const photosLeftElement = document.querySelector('.photos-left');

// Stats elements
const keptCount = document.getElementById('keptCount');
const deletedCount = document.getElementById('deletedCount');
const favoritedCount = document.getElementById('favoritedCount');

// Photo analysis elements
const qualityFill = document.getElementById('qualityFill');
const qualityText = document.getElementById('qualityText');
const duplicateCount = document.getElementById('duplicateCount');
const categoryText = document.getElementById('categoryText');
const dateText = document.getElementById('dateText');

// Action buttons
const rejectBtn = document.getElementById('rejectBtn');
const superLikeBtn = document.getElementById('superLikeBtn');
const likeBtn = document.getElementById('likeBtn');

// Swipe indicators
const leftIndicator = document.querySelector('.indicator.left');
const rightIndicator = document.querySelector('.indicator.right');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        initializePhotos();
        setupEventListeners();
    }, 2000);
});

function initializePhotos() {
    // Shuffle photos for random order
    shuffleArray(photoCollection);
    
    // Create initial photo cards
    for (let i = 0; i < Math.min(4, photoCollection.length); i++) {
        createPhotoCard(i);
    }
    
    updateUI();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createPhotoCard(index) {
    if (index >= photoCollection.length) return;
    
    const photo = photoCollection[index];
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.dataset.index = index;
    
    card.innerHTML = `
        <img src="${photo.url}" alt="Photo ${index + 1}" class="photo-image ${photo.quality < 40 ? 'low-quality' : ''}" loading="lazy">
        <div class="photo-overlay">
            <div class="photo-info">
                Quality: ${photo.quality}% • ${photo.category}
                ${photo.duplicates > 0 ? `• ${photo.duplicates} duplicates` : ''}
            </div>
        </div>
        ${photo.quality < 30 ? '<div class="glitch-overlay"></div>' : ''}
    `;
    
    photoStack.appendChild(card);
    
    // Add touch and mouse event listeners
    setupCardEvents(card);
}

function setupCardEvents(card) {
    // Mouse events
    card.addEventListener('mousedown', handleStart);
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseup', handleEnd);
    card.addEventListener('mouseleave', handleEnd);
    
    // Touch events
    card.addEventListener('touchstart', handleStart, { passive: false });
    card.addEventListener('touchmove', handleMove, { passive: false });
    card.addEventListener('touchend', handleEnd);
}

function handleStart(e) {
    if (e.target.closest('.photo-card').dataset.index != currentPhotoIndex) return;
    
    isDragging = true;
    const card = e.target.closest('.photo-card');
    card.classList.add('dragging');
    
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
    
    startX = clientX;
    startY = clientY;
    currentX = clientX;
    currentY = clientY;
    
    e.preventDefault();
}

function handleMove(e) {
    if (!isDragging) return;
    
    const card = e.target.closest('.photo-card');
    if (!card || card.dataset.index != currentPhotoIndex) return;
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
    
    currentX = clientX;
    currentY = clientY;
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const rotation = deltaX * 0.1;
    
    card.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${rotation}deg)`;
    card.style.opacity = 1 - Math.abs(deltaX) / 300;
    
    // Show indicators
    if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            rightIndicator.classList.add('active');
            leftIndicator.classList.remove('active');
            card.classList.add('swiping-right');
            card.classList.remove('swiping-left');
        } else {
            leftIndicator.classList.add('active');
            rightIndicator.classList.remove('active');
            card.classList.add('swiping-left');
            card.classList.remove('swiping-right');
        }
    } else {
        leftIndicator.classList.remove('active');
        rightIndicator.classList.remove('active');
        card.classList.remove('swiping-left', 'swiping-right');
    }
    
    e.preventDefault();
}

function handleEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    const card = e.target.closest('.photo-card');
    if (!card || card.dataset.index != currentPhotoIndex) return;
    
    card.classList.remove('dragging');
    leftIndicator.classList.remove('active');
    rightIndicator.classList.remove('active');
    
    const deltaX = currentX - startX;
    const threshold = 60;
    
    if (Math.abs(deltaX) > threshold) {
        // Swipe detected
        const direction = deltaX > 0 ? 'right' : 'left';
        swipePhoto(direction);
    } else {
        // Snap back
        card.style.transform = '';
        card.style.opacity = '';
        card.classList.remove('swiping-left', 'swiping-right');
    }
}

function swipePhoto(direction) {
    const currentCard = document.querySelector(`[data-index="${currentPhotoIndex}"]`);
    if (!currentCard) return;
    
    // Animate card out
    const exitX = direction === 'right' ? window.innerWidth : -window.innerWidth;
    const exitRotation = direction === 'right' ? 30 : -30;
    
    currentCard.style.transform = `translateX(${exitX}px) rotate(${exitRotation}deg)`;
    currentCard.style.opacity = '0';
    currentCard.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    
    // Update stats
    if (direction === 'right') {
        stats.kept++;
        showFeedback('Kept! 💚', 'success');
    } else {
        stats.deleted++;
        showFeedback('Deleted! 🗑️', 'error');
    }
    
    // Remove card after animation
    setTimeout(() => {
        currentCard.remove();
        nextPhoto();
    }, 300);
}

function favoritePhoto() {
    const currentCard = document.querySelector(`[data-index="${currentPhotoIndex}"]`);
    if (!currentCard) return;
    
    // Special favorite animation
    currentCard.style.transform = 'scale(1.2) rotate(5deg)';
    currentCard.style.transition = 'transform 0.3s ease';
    
    stats.favorited++;
    stats.kept++;
    showFeedback('Favorited! ⭐', 'favorite');
    
    setTimeout(() => {
        currentCard.style.transform = 'translateY(-100vh) rotate(15deg)';
        currentCard.style.opacity = '0';
        
        setTimeout(() => {
            currentCard.remove();
            nextPhoto();
        }, 300);
    }, 500);
}

function nextPhoto() {
    currentPhotoIndex++;
    
    // Add new photo to stack if available
    const nextIndex = currentPhotoIndex + 3;
    if (nextIndex < photoCollection.length) {
        createPhotoCard(nextIndex);
    }
    
    updateUI();
    
    // Check if all photos are done
    if (currentPhotoIndex >= photoCollection.length) {
        showCompletionScreen();
    }
}

function updateUI() {
    const remainingPhotos = photoCollection.length - currentPhotoIndex;
    photosLeftElement.textContent = `${remainingPhotos} photos left`;
    
    // Update stats
    keptCount.textContent = stats.kept;
    deletedCount.textContent = stats.deleted;
    favoritedCount.textContent = stats.favorited;
    
    // Update photo analysis for current photo
    if (currentPhotoIndex < photoCollection.length) {
        const currentPhoto = photoCollection[currentPhotoIndex];
        
        qualityFill.style.width = `${currentPhoto.quality}%`;
        qualityText.textContent = getQualityText(currentPhoto.quality);
        duplicateCount.textContent = `${currentPhoto.duplicates} found`;
        categoryText.textContent = currentPhoto.category;
        dateText.textContent = getRandomDate();
    }
}

function getQualityText(quality) {
    if (quality >= 80) return 'Excellent';
    if (quality >= 60) return 'Good';
    if (quality >= 40) return 'Fair';
    return 'Poor';
}

function getRandomDate() {
    const dates = ['Today', 'Yesterday', '2 days ago', '1 week ago', '2 weeks ago', '1 month ago'];
    return dates[Math.floor(Math.random() * dates.length)];
}

function showFeedback(message, type) {
    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
        if (type === 'favorite') {
            navigator.vibrate([100, 50, 100, 50, 100]);
        } else if (type === 'success') {
            navigator.vibrate(100);
        } else {
            navigator.vibrate(200);
        }
    }
    
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(${Math.random() * 10 - 5}deg);
        background: ${type === 'success' ? '#00ff00' : type === 'favorite' ? '#ffd700' : '#ff0000'};
        color: black;
        padding: 1rem 2rem;
        font-weight: 900;
        font-size: 1.5rem;
        border: 4px solid black;
        box-shadow: 8px 8px 0px black;
        z-index: 1000;
        animation: feedbackPop 1s ease;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-family: 'Inter', monospace;
    `;
    
    document.body.appendChild(feedback);
    
    // Screen flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${type === 'success' ? 'rgba(0, 255, 0, 0.1)' : type === 'favorite' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
        z-index: 999;
        animation: flashEffect 0.3s ease;
        pointer-events: none;
    `;
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        feedback.remove();
        flash.remove();
    }, 1000);
}

function showCompletionScreen() {
    document.getElementById('finalKept').textContent = stats.kept;
    document.getElementById('finalDeleted').textContent = stats.deleted;
    document.getElementById('finalFavorited').textContent = stats.favorited;
    
    completionScreen.classList.add('active');
}

function setupEventListeners() {
    // Action buttons
    rejectBtn.addEventListener('click', () => swipePhoto('left'));
    likeBtn.addEventListener('click', () => swipePhoto('right'));
    superLikeBtn.addEventListener('click', () => favoritePhoto());
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                swipePhoto('left');
                break;
            case 'ArrowRight':
                swipePhoto('right');
                break;
            case 'ArrowUp':
                favoritePhoto();
                break;
        }
    });
}

function restartDemo() {
    // Reset state
    currentPhotoIndex = 0;
    stats = { kept: 0, deleted: 0, favorited: 0 };
    
    // Clear photo stack
    photoStack.innerHTML = '';
    
    // Hide completion screen
    completionScreen.classList.remove('active');
    
    // Reinitialize
    initializePhotos();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes feedbackPop {
        0% { 
            transform: translate(-50%, -50%) scale(0.5) rotate(${Math.random() * 20 - 10}deg); 
            opacity: 0; 
        }
        50% { 
            transform: translate(-50%, -50%) scale(1.2) rotate(${Math.random() * 10 - 5}deg); 
            opacity: 1; 
        }
        100% { 
            transform: translate(-50%, -50%) scale(1) rotate(${Math.random() * 10 - 5}deg); 
            opacity: 1; 
        }
    }
    
    @keyframes flashEffect {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    .feedback.success {
        text-shadow: 2px 2px 0px black;
    }
    
    .feedback.error {
        text-shadow: 2px 2px 0px black;
        animation: feedbackPop 1s ease, shake 0.5s ease;
    }
    
    .feedback.favorite {
        text-shadow: 2px 2px 0px black;
        animation: feedbackPop 1s ease, sparkle 1s ease;
    }
    
    @keyframes shake {
        0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
        25% { transform: translate(-50%, -50%) rotate(-2deg); }
        75% { transform: translate(-50%, -50%) rotate(2deg); }
    }
    
    @keyframes sparkle {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.1); filter: brightness(1.2); }
    }
`;
document.head.appendChild(style); 