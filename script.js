let sortingPaused = true;  // Control if the sorting is paused
let currentStep = { i: 0, j: 0 };  // Track the current i, j indices for visualization
let currentArray = [];  // Track the current state of the array

// Function to create boxes for visualization
function createBoxes(array) {
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '';  // Clear previous boxes
    array.forEach(value => {
        const box = document.createElement('div');
        box.classList.add('box');
        box.textContent = value;
        visualizer.appendChild(box);
    });
}

// Function to update the info box with current i, j values and message
function updateInfoMessage(message) {
    document.getElementById('infoMessage').textContent = message;
}

// Sleep function for adding delay between sorting steps
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Wait for the user to press 'Next' to proceed
function waitForNextStep() {
    return new Promise(resolve => {
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.addEventListener('click', () => {
            resolve();
        }, { once: true });  // Ensure the event is only listened to once per step
    });
}

// Bubble Sort Algorithm with manual control and text messages
async function bubbleSort(array) {
    const boxes = document.querySelectorAll('.box');
    currentArray = [...array];  // Save the initial state of the array

    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            updateInfoMessage(`Comparing ${array[j]} and ${array[j + 1]}`);
            boxes[j].classList.add('active');
            boxes[j + 1].classList.add('active');

            await waitForNextStep();  // Wait for user to press 'Next'

            if (array[j] > array[j + 1]) {
                updateInfoMessage(`Swapping ${array[j]} and ${array[j + 1]} because ${array[j]} > ${array[j + 1]}`);
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                boxes[j].textContent = array[j];
                boxes[j + 1].textContent = array[j + 1];
            }

            await waitForNextStep();

            boxes[j].classList.remove('active');
            boxes[j + 1].classList.remove('active');
        }

        boxes[array.length - i - 1].classList.add('sorted');
    }
    boxes[0].classList.add('sorted');
    triggerConfetti();
}

// Selection Sort Algorithm with manual control and text messages
async function selectionSort(array) {
    const boxes = document.querySelectorAll('.box');
    currentArray = [...array];

    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        updateInfoMessage(`Starting selection sort at index ${i}, considering ${array[i]} as the current minimum.`);
        boxes[i].classList.add('active');
        await waitForNextStep();

        for (let j = i + 1; j < array.length; j++) {
            boxes[j].classList.add('active');
            updateInfoMessage(`Comparing ${array[j]} with current minimum ${array[minIndex]}.`);

            await waitForNextStep();

            if (array[j] < array[minIndex]) {
                updateInfoMessage(`${array[j]} is smaller than ${array[minIndex]}. Updating minimum.`);
                minIndex = j;
            }

            boxes[j].classList.remove('active');
        }

        updateInfoMessage(`Swapping ${array[i]} with ${array[minIndex]} as ${array[minIndex]} is the smallest.`);
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        boxes[i].textContent = array[i];
        boxes[minIndex].textContent = array[minIndex];

        boxes[i].classList.add('sorted');
        boxes[i].classList.remove('active');
    }
    triggerConfetti();
}

// Insertion Sort Algorithm with manual control and text messages
async function insertionSort(array) {
    const boxes = document.querySelectorAll('.box');
    currentArray = [...array];  // Save the initial state of the array

    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        boxes[i].classList.add('active');  // Highlight the key element being inserted
        updateInfoMessage(`Starting insertion sort. Key is ${key}.`);

        await waitForNextStep();  // Wait for the user to press 'Next'

        while (j >= 0 && array[j] > key) {
            updateInfoMessage(`Comparing ${array[j]} with key ${key}. Shifting ${array[j]} because ${array[j]} > ${key}.`);
            array[j + 1] = array[j];  // Shift element to the right
            boxes[j + 1].textContent = array[j + 1];  // Update the box content after shifting
            boxes[j + 1].classList.add('swapping');  // Highlight the element being shifted

            await waitForNextStep();  // Wait for the user to press 'Next'
            boxes[j + 1].classList.remove('swapping');  // Remove swapping highlight

            j--;  // Move to the next element on the left
        }

        updateInfoMessage(`Placing key ${key} in its correct position.`);
        array[j + 1] = key;
        boxes[j + 1].textContent = key;  // Update the box content
        boxes[i].classList.remove('active');  // Remove the active highlight from the key element
        boxes[j + 1].classList.add('sorted');  // Mark the placed element as sorted

        await waitForNextStep();  // Wait for the user to press 'Next'

        for (let k = 0; k <= i; k++) {
            boxes[k].classList.add('sorted');
        }
    }

    for (let i = 0; i < array.length; i++) {
        boxes[i].classList.add('sorted');
    }
    triggerConfetti();
}

// Generate a random array
function generateRandomArray() {
    const array = [];
    for (let i = 0; i < 10; i++) {
        array.push(Math.floor(Math.random() * 50) + 1);  // Random numbers between 1 and 50
    }
    createBoxes(array);
    return array;
}

// Start sorting based on selected algorithm
function startSorting() {
    sortingPaused = false;  // Start sorting when the user clicks 'Start'
    const arrayInput = document.getElementById('arrayInput').value;
    const algorithm = document.getElementById('algorithm').value;
    let array;

    if (arrayInput) {
        array = arrayInput.split(',').map(Number);
    } else {
        array = generateRandomArray();
    }

    createBoxes(array);

    if (algorithm === 'bubble') {
        bubbleSort(array);
    } else if (algorithm === 'selection') {
        selectionSort(array);
    } else if (algorithm === 'insertion') {
        insertionSort(array);  // Call the updated insertionSort function
    }
}

// Event listeners for buttons
document.getElementById('startBtn').addEventListener('click', startSorting);
document.getElementById('randomBtn').addEventListener('click', generateRandomArray);
document.getElementById('stopBtn').addEventListener('click', () => {
    sortingPaused = true;  // Stop the sorting process
});

// Dark mode toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Confetti animation
function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}