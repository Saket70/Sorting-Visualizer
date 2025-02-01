// Global variables
let sortingPaused = true;
let currentArray = [];
let animationSpeed = 3000; // 3 seconds delay

// Create floating particles
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = 10 + Math.random() * 20 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Enhanced confetti animation
function triggerConfetti() {
    const duration = 3000;
    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        shapes: ['square', 'circle']
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
        const timeLeft = duration - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}

// Enhanced info message updates with animations
function updateInfoMessage(message) {
    const infoBox = document.getElementById('infoMessage');
    infoBox.style.opacity = '0';
    
    setTimeout(() => {
        infoBox.innerHTML = `<i class="fas fa-info-circle"></i><span>${message}</span>`;
        infoBox.style.opacity = '1';
    }, 300);
}

// Sleep function with dynamic delay based on array size
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Enhanced box creation with smooth animations
function createBoxes(array) {
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '';
    
    array.forEach((value, index) => {
        const box = document.createElement('div');
        box.classList.add('box');
        box.textContent = value;
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        visualizer.appendChild(box);
        
        setTimeout(() => {
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Auto-step function replacing waitForNextStep
async function autoStep() {
    await sleep(animationSpeed);
}

// Enhanced bubble sort with automatic animations
async function bubbleSort(array) {
    const boxes = document.querySelectorAll('.box');
    currentArray = [...array];

    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (sortingPaused) return;

            updateInfoMessage(`Comparing ${array[j]} and ${array[j + 1]}`);
            boxes[j].classList.add('active');
            boxes[j + 1].classList.add('active');

            await autoStep();

            if (array[j] > array[j + 1]) {
                updateInfoMessage(`Swapping ${array[j]} and ${array[j + 1]}`);
                boxes[j].classList.add('swapping');
                boxes[j + 1].classList.add('swapping');
                
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                
                const temp = boxes[j].textContent;
                boxes[j].textContent = boxes[j + 1].textContent;
                boxes[j + 1].textContent = temp;
                
                await sleep(300);
                boxes[j].classList.remove('swapping');
                boxes[j + 1].classList.remove('swapping');
            }

            boxes[j].classList.remove('active');
            boxes[j + 1].classList.remove('active');
        }
        boxes[array.length - i - 1].classList.add('sorted');
    }
    boxes[0].classList.add('sorted');
    updateInfoMessage('Sorting completed! 🎉');
    triggerConfetti();
}

// Enhanced selection sort with automatic animations
async function selectionSort(array) {
    const boxes = document.querySelectorAll('.box');
    currentArray = [...array];

    for (let i = 0; i < array.length; i++) {
        if (sortingPaused) return;

        let minIndex = i;
        boxes[i].classList.add('active');
        updateInfoMessage(`Finding minimum element starting from index ${i}`);

        await autoStep();

        for (let j = i + 1; j < array.length; j++) {
            if (sortingPaused) return;

            boxes[j].classList.add('active');
            updateInfoMessage(`Comparing ${array[j]} with current minimum ${array[minIndex]}`);

            await autoStep();

            if (array[j] < array[minIndex]) {
                boxes[minIndex].classList.remove('active');
                minIndex = j;
                boxes[minIndex].classList.add('active');
            }

            boxes[j].classList.remove('active');
        }

        if (minIndex !== i) {
            updateInfoMessage(`Swapping ${array[i]} with ${array[minIndex]}`);
            boxes[i].classList.add('swapping');
            boxes[minIndex].classList.add('swapping');

            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            boxes[i].textContent = array[i];
            boxes[minIndex].textContent = array[minIndex];

            await sleep(300);
            boxes[i].classList.remove('swapping');
            boxes[minIndex].classList.remove('swapping');
        }

        boxes[i].classList.add('sorted');
        boxes[i].classList.remove('active');
    }
    
    updateInfoMessage('Sorting completed! 🎉');
    triggerConfetti();
}

// Enhanced insertion sort with automatic animations
async function insertionSort(array) {
    const boxes = document.querySelectorAll('.box');
    currentArray = [...array];

    for (let i = 1; i < array.length; i++) {
        if (sortingPaused) return;

        let key = array[i];
        let j = i - 1;
        
        boxes[i].classList.add('active');
        updateInfoMessage(`Inserting ${key} into sorted portion`);
        
        await autoStep();

        while (j >= 0 && array[j] > key) {
            if (sortingPaused) return;

            updateInfoMessage(`Moving ${array[j]} to the right`);
            boxes[j].classList.add('swapping');
            boxes[j + 1].classList.add('swapping');

            array[j + 1] = array[j];
            boxes[j + 1].textContent = array[j];

            await sleep(300);
            boxes[j].classList.remove('swapping');
            boxes[j + 1].classList.remove('swapping');
            
            j--;
        }

        array[j + 1] = key;
        boxes[j + 1].textContent = key;
        boxes[i].classList.remove('active');

        for (let k = 0; k <= i; k++) {
            boxes[k].classList.add('sorted');
        }
    }

    updateInfoMessage('Sorting completed! 🎉');
    triggerConfetti();
}

// Generate random array with improved animation
function generateRandomArray() {
    const array = Array.from({length: 8}, () => Math.floor(Math.random() * 50) + 1);
    createBoxes(array);
    updateInfoMessage('Generated new random array');
    return array;
}

// Enhanced start sorting function
function startSorting() {
    sortingPaused = false;
    const arrayInput = document.getElementById('arrayInput').value;
    const algorithm = document.getElementById('algorithm').value;
    let array;

    if (arrayInput) {
        array = arrayInput.split(',').map(num => {
            const parsed = parseInt(num.trim());
            return isNaN(parsed) ? 0 : parsed;
        });
    } else {
        array = generateRandomArray();
    }

    createBoxes(array);

    switch(algorithm) {
        case 'bubble':
            bubbleSort(array);
            break;
        case 'selection':
            selectionSort(array);
            break;
        case 'insertion':
            insertionSort(array);
            break;
    }
}

// Event listeners
document.getElementById('startBtn').addEventListener('click', startSorting);
document.getElementById('randomBtn').addEventListener('click', generateRandomArray);
document.getElementById('stopBtn').addEventListener('click', () => {
    sortingPaused = true;
    updateInfoMessage('Sorting paused');
});

// Enhanced theme toggle with animation
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#themeToggle i');
    icon.className = document.body.classList.contains('dark-mode') ? 
        'fas fa-sun' : 'fas fa-moon';
});

// Initialize
window.addEventListener('load', () => {
    createParticles();
    generateRandomArray();
});