document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
        window.location.href = 'login.html';
    }
    // --- DỮ LIỆU GIẢ (DUMMY DATA) ---
    // Trong thực tế, bạn sẽ lấy dữ liệu này từ API backend
    const mockData = {
        users: [
            { userId: 'U001', username: 'nguyenvana', password: '123321', email: 'a@example.com', phoneNumber: '0912345678', gender: 'Nam', dob: '1990-01-15', role: 'admin' },
            { userId: 'U002', username: 'tranthib', password: '123321', email: 'b@example.com', phoneNumber: '0987654321', gender: 'Nữ', dob: '1995-05-20', role: 'user' },
            { userId: 'U003', username: 'lehuuc', password: '123321', email: 'c@example.com', phoneNumber: '0905558888', gender: 'Nam', dob: '1988-11-30', role: 'user' },
        ],
        metricTypes: [
            { metricId: 'M01', name: 'Nhịp tim', unit: 'bpm' }, { metricId: 'M02', name: 'Huyết áp', unit: 'mmHg' },
            { metricId: 'M03', name: 'Nồng độ Oxy', unit: '%' }, { metricId: 'M04', name: 'Số bước chân', unit: 'bước' },
        ],
        dailyLogs: [
            { logId: 'L001', userId: 'U001', logDate: '2025-07-05', note: 'Cảm thấy khỏe.' }, { logId: 'L002', userId: 'U002', logDate: '2025-07-05', note: 'Bình thường.' },
            { logId: 'L003', userId: 'U001', logDate: '2025-07-06', note: 'Hơi mệt.' }, { logId: 'L004', userId: 'U003', logDate: '2025-07-06', note: 'Đi bộ 5000 bước.' },
        ],
        healthRecords: [
            { healthRecordId: 'HR001', logId: 'L001', metricTypeId: 'M01', value: '75' }, { healthRecordId: 'HR002', logId: 'L001', metricTypeId: 'M02', value: '120/80' },
            { healthRecordId: 'HR003', logId: 'L002', metricTypeId: 'M01', value: '80' }, { healthRecordId: 'HR004', logId: 'L003', metricTypeId: 'M01', value: '90' },
            { healthRecordId: 'HR005', logId: 'L004', metricTypeId: 'M04', value: '5120' },
        ],
        targets: [
            { targetId: 'T01', userId: 'U001', title: 'Giảm huyết áp', status: 'In Progress', startDate: '2025-07-01', endDate: '2025-07-31' },
            { targetId: 'T02', userId: 'U003', title: 'Đi bộ mỗi ngày', status: 'Completed', startDate: '2025-06-01', endDate: '2025-06-30' }
        ]
    };

    // Giả lập người dùng đang đăng nhập
    const currentUser = { username: 'Adminstrator' };
    document.getElementById('current-user-name').textContent = currentUser.username;

    // --- CÁC HÀM RENDER DỮ LIỆU ---

    function renderAllTables() {
        renderUsersTable();
        renderRecordsTable();
        renderTargetsTable();
        renderDashboardStats();
    }

    function renderUsersTable() {
        const tbody = document.getElementById('users-table-body');
        tbody.innerHTML = '';
        mockData.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.userId}</td> <td>${user.username}</td> <td>${user.password}</td> <td>${user.email}</td>
                <td>${user.phoneNumber}</td> <td>${user.gender}</td> <td>${user.dob}</td>
                <td>${user.role}</td>
                <td>
                    <button class="action-btn btn-edit" data-id="${user.userId}" data-modal="user-modal">Sửa</button>
                    <button class="action-btn btn-delete" data-id="${user.userId}" data-type="user">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function renderRecordsTable() {
        const tbody = document.getElementById('records-table-body');
        tbody.innerHTML = '';
        mockData.healthRecords.forEach(record => {
            const log = mockData.dailyLogs.find(l => l.logId === record.logId);
            const user = log ? mockData.users.find(u => u.userId === log.userId) : null;
            const metricType = mockData.metricTypes.find(mt => mt.metricId === record.metricTypeId);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.healthRecordId}</td> <td>${user ? user.username : 'N/A'}</td>
                <td>${log ? log.logDate : 'N/A'}</td> <td>${metricType ? metricType.name : 'N/A'}</td>
                <td>${record.value}</td> <td>${metricType ? metricType.unit : 'N/A'}</td>
                <td>
                    <button class="action-btn btn-delete" data-id="${record.healthRecordId}" data-type="record">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function renderTargetsTable() {
        const tbody = document.getElementById('targets-table-body');
        tbody.innerHTML = '';
        mockData.targets.forEach(target => {
            const user = mockData.users.find(u => u.userId === target.userId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${target.targetId}</td> <td>${user ? user.username : 'N/A'}</td>
                <td>${target.title}</td> <td>${target.status}</td>
                <td>${target.startDate}</td> <td>${target.endDate}</td>
                <td>
                    <button class="action-btn btn-edit" data-id="${target.targetId}" data-modal="target-modal">Sửa</button>
                    <button class="action-btn btn-delete" data-id="${target.targetId}" data-type="target">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function renderDashboardStats() {
        document.getElementById('total-users').textContent = mockData.users.length;
        document.getElementById('total-records').textContent = mockData.healthRecords.length;
        document.getElementById('active-targets').textContent = mockData.targets.filter(t => t.status === 'In Progress').length;
    }

    // --- LOGIC MODAL ---
    const modals = document.querySelectorAll('.modal');

    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    modals.forEach(modal => {
        modal.querySelector('.close-btn').addEventListener('click', () => closeModal(modal));
    });

    window.addEventListener('click', (event) => {
        modals.forEach(modal => {
            if (event.target == modal) {
                closeModal(modal);
            }
        });
    });

    // --- LOGIC THÊM / SỬA / XÓA ---

    // Mở modal khi nhấn nút "Thêm" hoặc "Sửa"
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('.btn-add') || e.target.matches('.btn-edit')) {
            const modalId = e.target.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            const recordId = e.target.getAttribute('data-id');

            openModal(modalId);

            if (modalId === 'user-modal') {
                setupUserForm(recordId);
            } else if (modalId === 'target-modal') {
                setupTargetForm(recordId);
            }
        }

        if (e.target.matches('.btn-delete')) {
            const recordId = e.target.getAttribute('data-id');
            const type = e.target.getAttribute('data-type');
            handleDelete(recordId, type);
        }
    });

    // Xử lý form User
    function setupUserForm(id = null) {
        const form = document.getElementById('user-form');
        form.reset();
        document.getElementById('user-modal-title').textContent = id ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới';
        document.getElementById('user-id').value = id || '';

        if (id) {
            const user = mockData.users.find(u => u.userId === id);
            document.getElementById('username').value = user.username;
            document.getElementById('password').value = user.password;
            document.getElementById('email').value = user.email;
            document.getElementById('phone').value = user.phoneNumber;
            document.getElementById('gender').value = user.gender;
            document.getElementById('dob').value = user.dob;
            document.getElementById('role').value = user.role;
        }
    }

    document.getElementById('user-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('user-id').value;
        const userData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phone').value,
            gender: document.getElementById('gender').value,
            dob: document.getElementById('dob').value,
            role: document.getElementById('role').value, // Thêm dòng này
        };

        if (id) { // Sửa
            const userIndex = mockData.users.findIndex(u => u.userId === id);
            mockData.users[userIndex] = { ...mockData.users[userIndex], ...userData };
        } else { // Thêm
            userData.userId = 'U' + (Math.max(...mockData.users.map(u => parseInt(u.userId.slice(1)))) + 1).toString().padStart(3, '0');
            mockData.users.push(userData);
        }
        renderAllTables();
        closeModal(document.getElementById('user-modal'));
    });

    // Xử lý form Target
    function setupTargetForm(id = null) {
        const form = document.getElementById('target-form');
        form.reset();
        document.getElementById('target-modal-title').textContent = id ? 'Sửa mục tiêu' : 'Thêm mục tiêu mới';
        document.getElementById('target-id').value = id || '';

        // Populate user dropdown
        const userSelect = document.getElementById('target-user-id');
        userSelect.innerHTML = mockData.users.map(u => `<option value="${u.userId}">${u.username}</option>`).join('');

        if (id) {
            const target = mockData.targets.find(t => t.targetId === id);
            userSelect.value = target.userId;
            document.getElementById('target-title').value = target.title;
            document.getElementById('target-status').value = target.status;
            document.getElementById('target-start-date').value = target.startDate;
            document.getElementById('target-end-date').value = target.endDate;
        }
    }

    document.getElementById('target-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('target-id').value;
        const targetData = {
            userId: document.getElementById('target-user-id').value,
            title: document.getElementById('target-title').value,
            status: document.getElementById('target-status').value,
            startDate: document.getElementById('target-start-date').value,
            endDate: document.getElementById('target-end-date').value,
        };

        if (id) { // Sửa
            const targetIndex = mockData.targets.findIndex(t => t.targetId === id);
            mockData.targets[targetIndex] = { ...mockData.targets[targetIndex], ...targetData };
        } else { // Thêm
            targetData.targetId = 'T' + (Math.max(...mockData.targets.map(t => parseInt(t.targetId.slice(1)))) + 1).toString().padStart(2, '0');
            mockData.targets.push(targetData);
        }
        renderAllTables();
        closeModal(document.getElementById('target-modal'));
    });

    // Xử lý xóa
    function handleDelete(id, type) {
        if (!confirm(`Bạn có chắc chắn muốn xóa bản ghi này không?`)) {
            return;
        }

        if (type === 'user') {
            mockData.users = mockData.users.filter(u => u.userId !== id);
            // Cũng nên xóa các dữ liệu liên quan (log, record, target) của user này
            mockData.dailyLogs = mockData.dailyLogs.filter(log => log.userId !== id);
            // Lọc healthRecords dựa trên dailyLogs đã bị xóa
            mockData.healthRecords = mockData.healthRecords.filter(rec => !mockData.dailyLogs.find(log => log.logId === rec.logId && log.userId === id));
            mockData.targets = mockData.targets.filter(t => t.userId !== id);
        } else if (type === 'record') {
            mockData.healthRecords = mockData.healthRecords.filter(r => r.healthRecordId !== id);
        } else if (type === 'target') {
            mockData.targets = mockData.targets.filter(t => t.targetId !== id);
        }
        renderAllTables();
    }

    // --- XỬ LÝ SỰ KIỆN KHÁC ---

    // Đăng xuất
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Bạn có muốn đăng xuất không?')) {
            localStorage.removeItem('isLoggedIn'); // Xóa trạng thái đăng nhập
            localStorage.removeItem('loggedInUser'); // Xóa tên người dùng đã đăng nhập
            window.location.href = 'login.html'; // Chuyển hướng về trang đăng nhập
        }
    });

    // Chuyển tab
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.nav-link.active').classList.remove('active');
            link.classList.add('active');
            document.querySelector('.content-section.active').classList.remove('active');
            document.getElementById(link.getAttribute('data-target')).classList.add('active');
        });
    });

    // --- KHỞI TẠO ---
    renderAllTables();
});