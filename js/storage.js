class Storage {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        if (!localStorage.getItem('wheelData')) {
            const defaultData = {
                action: ['跑步', '跳舞', '唱歌', '画画', '阅读'],
                body: ['手', '脚', '头', '肩', '膝']
            };
            localStorage.setItem('wheelData', JSON.stringify(defaultData));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem('wheelData'));
    }

    setData(data) {
        localStorage.setItem('wheelData', JSON.stringify(data));
    }

    getItems(category) {
        const data = this.getData();
        return data[category] || [];
    }

    addItem(category, item) {
        const data = this.getData();
        if (!data[category]) {
            data[category] = [];
        }
        if (!data[category].includes(item)) {
            data[category].push(item);
            this.setData(data);
            return true;
        }
        return false;
    }

    removeItem(category, item) {
        const data = this.getData();
        if (data[category]) {
            const index = data[category].indexOf(item);
            if (index !== -1) {
                data[category].splice(index, 1);
                this.setData(data);
                return true;
            }
        }
        return false;
    }
}

const storage = new Storage(); 