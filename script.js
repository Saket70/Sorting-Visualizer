document.getElementById('startBtn').addEventListener('click', startSorting);
document.getElementById('randomBtn').addEventListener('click', generateRandomArray);
document.getElementById('stopBtn').addEventListener('click', () => sortingPaused = true);

let sortingPaused = false;

function createBoxes(array) {
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '';
    array.forEach(value => {
        const box = document.createElement('div');
        box.classList.add('box');
        box.textContent = value;
        box.style.height = `${value * 5}px`;
        visualizer.appendChild(box);
    });
}

async function bubbleSort(array) {
    const boxes = document.querySelectorAll('.box');
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            boxes[j].classList.add('active');
            boxes[j + 1].classList.add('active');
            await sleep(500);

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                boxes[j].textContent = array[j];
                boxes[j + 1].textContent = array[j + 1];
                gsap.to(boxes[j], { y: -20, duration: 0.2 });
                gsap.to(boxes[j + 1], { y: 20, duration: 0.2 });

                await sleep(500);
            }

            boxes[j].classList.remove('active');
            boxes[j + 1].classList.remove('active');
        }

        boxes[array.length - i - 1].classList.add('sorted');
    }
    boxes[0].classList.add('sorted');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateRandomArray() {
    let array = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 1);
    createBoxes(array);
    return array;
}

function startSorting() {
    let array = generateRandomArray();
    bubbleSort(array);
}
