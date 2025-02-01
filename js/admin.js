class Admin {
    constructor() {
        this.categorySelect = document.getElementById('categorySelect');
        this.dataTable = document.getElementById('dataTable');
        this.addForm = document.getElementById('addForm');
        
        this.init();
    }

    init() {
        this.categorySelect.addEventListener('change', () => this.loadData());
        this.addForm.addEventListener('submit', (e) => this.handleAdd(e));
        this.loadData();
    }

    loadData() {
        const category = this.categorySelect.value;
        const items = storage.getItems(category);
        
        const tbody = this.dataTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item}</td>
                <td>
                    <button class="btn" onclick="admin.handleDelete('${item}')">删除</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    handleAdd(e) {
        e.preventDefault();
        const category = this.categorySelect.value;
        const itemInput = document.getElementById('newItem');
        const item = itemInput.value.trim();
        
        if (!item) {
            alert('请输入内容');
            return;
        }
        
        if (storage.addItem(category, item)) {
            this.loadData();
            itemInput.value = '';
        } else {
            alert('该项已存在');
        }
    }

    handleDelete(item) {
        if (confirm(`确定要删除 "${item}" 吗？`)) {
            const category = this.categorySelect.value;
            if (storage.removeItem(category, item)) {
                this.loadData();
            }
        }
    }
}

// 页面加载完成后初始化管理界面
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new Admin();
}); 