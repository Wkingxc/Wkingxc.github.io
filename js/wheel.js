class Wheel {
    constructor() {
        this.wheel = document.getElementById('wheel');
        this.spinButton = document.getElementById('spinButton');
        this.arraySelector = document.getElementById('arraySelector');
        this.resultDisplay = document.getElementById('result');
        this.currentRotation = 0;
        this.isSpinning = false;
        
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', 
            '#96CEB4', '#FFEEAD', '#D4A5A5', '#9ED2C6'
        ];

        this.init();
    }

    init() {
        this.spinButton.addEventListener('click', () => this.spin());
        this.arraySelector.addEventListener('change', () => {
            this.createWheel();
            this.resultDisplay.textContent = '等待转盘停止...';
        });
        this.createWheel();
    }

    createWheel() {
        const array = storage.getItems(this.arraySelector.value);
        if (array.length === 0) {
            this.resultDisplay.textContent = '当前类别没有数据';
            this.spinButton.disabled = true;
            return;
        }
        
        this.spinButton.disabled = false;
        this.wheel.innerHTML = '';
        const sliceAngle = 360 / array.length;

        array.forEach((item, index) => {
            const startAngle = index * sliceAngle;
            const endAngle = (index + 1) * sliceAngle;
            
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            
            const x1 = 200 + 180 * Math.cos(startRad);
            const y1 = 200 + 180 * Math.sin(startRad);
            const x2 = 200 + 180 * Math.cos(endRad);
            const y2 = 200 + 180 * Math.sin(endRad);
            
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", `M 200 200 L ${x1} ${y1} A 180 180 0 0 1 ${x2} ${y2} Z`);
            path.setAttribute("fill", this.colors[index % this.colors.length]);
            path.setAttribute("stroke", "white");
            path.setAttribute("stroke-width", "2");
            
            const textAngle = (startAngle + endAngle) / 2;
            const textRad = (textAngle - 90) * Math.PI / 180;
            const textX = 200 + 100 * Math.cos(textRad);
            const textY = 200 + 100 * Math.sin(textRad);
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", textX);
            text.setAttribute("y", textY);
            text.setAttribute("fill", "black");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.setAttribute("transform", `rotate(${textAngle}, ${textX}, ${textY})`);
            text.style.fontSize = "16px";
            text.style.fontWeight = "bold";
            text.textContent = item;
            
            this.wheel.appendChild(path);
            this.wheel.appendChild(text);
        });
    }

    getResult(rotation, array) {
        const sliceAngle = 360 / array.length;
        const normalizedRotation = ((rotation % 360) + 360) % 360;
        const index = Math.floor(normalizedRotation / sliceAngle);
        return array[array.length - 1 - index];
    }

    spin() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.spinButton.disabled = true;
        this.spinButton.textContent = '旋转中...';
        this.resultDisplay.textContent = '转盘旋转中...';
        
        const minSpins = 5;
        const maxSpins = 8;
        const spins = minSpins + Math.random() * (maxSpins - minSpins);
        const randomAngle = spins * 360 + Math.random() * 360;
        this.currentRotation += randomAngle;
        
        this.wheel.style.transform = `rotate(${this.currentRotation}deg)`;
        
        setTimeout(() => {
            this.isSpinning = false;
            this.spinButton.disabled = false;
            this.spinButton.textContent = '开始转动';
            
            const currentArray = storage.getItems(this.arraySelector.value);
            const result = this.getResult(this.currentRotation, currentArray);
            
            this.resultDisplay.style.opacity = '0';
            setTimeout(() => {
                this.resultDisplay.textContent = `最终结果：${result}`;
                this.resultDisplay.style.opacity = '1';
            }, 200);
        }, 7000);
    }
}

// 页面加载完成后初始化转盘
document.addEventListener('DOMContentLoaded', () => {
    new Wheel();
}); 