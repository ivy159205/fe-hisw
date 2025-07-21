// js/admin-script.js

document.addEventListener('DOMContentLoaded', () => {
    // Chuyển hướng nếu chưa đăng nhập
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }

    // Lấy tên người dùng hiện tại từ localStorage hoặc mặc định là 'Admin'
    const currentUserName = localStorage.getItem('currentUser') || 'Admin';
    document.getElementById('current-user-name').textContent = currentUserName;

    // --- Khởi tạo và Thiết lập Ban đầu ---
    renderAllTables(); // Tải tất cả dữ liệu bảng khi trang được tải

    // --- Xử lý Chuyển đổi Tab (Content Section) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            // Loại bỏ lớp 'active' khỏi tất cả các liên kết và section
            navLinks.forEach(item => item.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // Thêm lớp 'active' vào liên kết được nhấp
            link.classList.add('active');

            // Hiển thị section tương ứng
            const targetId = link.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Gọi hàm render bảng tương ứng khi chuyển tab
            switch (targetId) {
                case 'users':
                    renderUsersTable();
                    break;
                case 'records':
                    renderHealthRecordsTable();
                    break;
                case 'targets':
                    renderTargetsTable();
                    break;
                case 'metric-types':
                    renderMetricTypesTable();
                    break;
                case 'dashboard':
                    renderDashboardStats();
                    break;
            }
        });
    });

    // Kích hoạt tab dashboard khi tải trang
    document.querySelector('.nav-link[data-target="dashboard"]').click();


    // --- Hàm mở/đóng Modal (Thống nhất 1 hàm) ---
    function openModal(modal) {
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10); // Thêm class 'show' sau một chút để có hiệu ứng fade
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300); // Ẩn modal sau khi animation hoàn tất
    }

    // Xử lý đóng modal khi click nút đóng hoặc bên ngoài modal
    document.querySelectorAll('.close-btn, .close-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const modal = event.target.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });


    // --- Hàm Format ID (để hiển thị đẹp hơn) ---
    function formatUserId(id) {
        if (id === null || typeof id === 'undefined') return '';
        return `U${String(id).padStart(3, '0')}`;
    }

    function formatHealthRecordId(id) {
        if (id === null || typeof id === 'undefined') return '';
        return `HR${String(id).padStart(3, '0')}`;
    }

    function formatTargetId(id) {
        if (id === null || typeof id === 'undefined') return '';
        return `T${String(id).padStart(3, '0')}`;
    }

    // Thêm hàm format cho MetricType ID để hiển thị M00X
    function formatMetricTypeId(id) {
        if (id === null || typeof id === 'undefined') return '';
        return `M${String(id).padStart(3, '0')}`;
    }


    // --- Hàm Render Dashboard Stats ---
    async function renderDashboardStats() {
        try {
            const usersResponse = await fetch('http://localhost:8286/api/users/count');
            const totalUsers = await usersResponse.json();
            document.getElementById('total-users').textContent = totalUsers;

            const recordsResponse = await fetch('http://localhost:8286/api/healthrecords/count');
            const totalRecords = await recordsResponse.json();
            document.getElementById('total-records').textContent = totalRecords;

            const activeTargetsResponse = await fetch('http://localhost:8286/api/targets/active/count');
            const activeTargets = await activeTargetsResponse.json();
            document.getElementById('active-targets').textContent = activeTargets;

        } catch (error) {
            console.error('Lỗi khi tải thống kê Dashboard:', error);
            document.getElementById('total-users').textContent = 'N/A';
            document.getElementById('total-records').textContent = 'N/A';
            document.getElementById('active-targets').textContent = 'N/A';
            alert('Không thể tải dữ liệu thống kê. Vui lòng thử lại.');
        }
    }


    // --- Hàm Render Bảng Người dùng ---
    async function renderUsersTable() {
        const tbody = document.getElementById('users-table-body');
        tbody.innerHTML = '';
        try {
            const response = await fetch('http://localhost:8286/api/users');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const users = await response.json();

            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9">Không có người dùng nào trong hệ thống.</td></tr>';
                return;
            }

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatUserId(user.userId)}</td>
                    <td>${user.username}</td>
                    <td>${user.password}</td>
                    <td>${user.email}</td>
                    <td>${user.phoneNumber || ''}</td>
                    <td>${user.gender || ''}</td>
                    <td>${user.dob || ''}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="action-btn btn-edit" data-id="${user.userId}" data-modal="user-modal">Sửa</button>
                        <button class="action-btn btn-delete" data-id="${user.userId}" data-type="user">Xóa</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Lỗi khi tải danh sách người dùng:', error);
            tbody.innerHTML = '<tr><td colspan="9">Không thể tải dữ liệu người dùng. Vui lòng thử lại.</td></tr>';
        }
    }

    // --- Hàm Setup Form Người dùng ---
    function setupUserForm(id = null) {
        const form = document.getElementById('user-form');
        form.reset();
        document.getElementById('user-modal-title').textContent = id ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới';
        document.getElementById('user-id').value = id || '';

        const passwordInput = document.getElementById('password');
        const passwordGroup = passwordInput.closest('.form-group');
        if (id) {
            passwordGroup.style.display = 'none'; // Ẩn mật khẩu khi sửa
            passwordInput.removeAttribute('required'); // Bỏ yêu cầu bắt buộc
        } else {
            passwordGroup.style.display = 'block'; // Hiển thị mật khẩu khi thêm mới
            passwordInput.setAttribute('required', 'required'); // Yêu cầu bắt buộc
        }

        if (id) {
            fetch(`http://localhost:8286/api/users/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(user => {
                    document.getElementById('username').value = user.username;
                    document.getElementById('email').value = user.email;
                    document.getElementById('phone').value = user.phoneNumber || '';
                    document.getElementById('gender').value = user.gender || 'Khác';
                    document.getElementById('dob').value = user.dob || '';
                    document.getElementById('role').value = user.role;
                })
                .catch(error => {
                    console.error('Lỗi khi tải thông tin người dùng để sửa:', error);
                    alert('Không thể tải thông tin người dùng. Vui lòng thử lại.');
                    closeModal(document.getElementById('user-modal'));
                });
        }
    }

    // --- Xử lý Submit Form Người dùng ---
    document.getElementById('user-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const userId = document.getElementById('user-id').value;
        const userData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phone').value,
            gender: document.getElementById('gender').value,
            dob: document.getElementById('dob').value,
            role: document.getElementById('role').value
        };

        // Chỉ thêm password vào payload nếu là thêm mới
        if (!userId) {
            userData.password = document.getElementById('password').value;
        }

        let url = 'http://localhost:8286/api/users';
        let method = 'POST';

        if (userId) {
            url = `http://localhost:8286/api/users/${userId}`;
            method = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            renderAllTables();
            closeModal(document.getElementById('user-modal'));
            alert(userId ? 'Cập nhật người dùng thành công!' : 'Thêm người dùng mới thành công!');
        } catch (error) {
            console.error('Lỗi khi lưu người dùng:', error);
            alert(`Lỗi khi lưu người dùng: ${error.message}. Vui lòng kiểm tra dữ liệu và thử lại.`);
        }
    });


    // --- Hàm Render Bảng Hồ sơ sức khỏe ---
    async function renderHealthRecordsTable() {
        const tbody = document.getElementById('records-table-body');
        tbody.innerHTML = '';

        try {
            const recordsResponse = await fetch('http://localhost:8286/api/healthrecords');
            if (!recordsResponse.ok) {
                throw new Error(`HTTP error! status: ${recordsResponse.status}`);
            }
            const records = await recordsResponse.json();

            const usersResponse = await fetch('http://localhost:8286/api/users');
            if (!usersResponse.ok) {
                throw new Error(`HTTP error! status: ${usersResponse.status}`);
            }
            const users = await usersResponse.json();
            const userMap = new Map(users.map(user => [user.userId, user.username]));

            const metricTypesResponse = await fetch('http://localhost:8286/api/metrics');
            if (!metricTypesResponse.ok) {
                throw new Error(`HTTP error! status: ${metricTypesResponse.status}`);
            }
            const metricTypes = await metricTypesResponse.json();
            // Backend trả về MetricType object, nên dùng metric.metricId để mapping
            const metricTypeMap = new Map(metricTypes.map(metric => [metric.metricId, { name: metric.name, unit: metric.unit }]));


            if (records.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">Không có hồ sơ sức khỏe nào trong hệ thống.</td></tr>';
                return;
            }

            records.forEach(record => {
                const userName = userMap.get(record.userId) || 'Không xác định';
                // Sử dụng record.metricTypeId trực tiếp
                const metricInfo = metricTypeMap.get(record.metricTypeId) || { name: 'Không xác định', unit: '' };

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatHealthRecordId(record.healthRecordId)}</td>
                    <td>${userName}</td>
                    <td>${record.logDate || ''}</td>
                    <td>${metricInfo.name}</td>
                    <td>${record.value}</td>
                    <td>${metricInfo.unit}</td>
                    <td>
                        <button class="action-btn btn-delete" data-id="${record.healthRecordId}" data-type="healthrecord">Xóa</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Lỗi khi tải danh sách hồ sơ sức khỏe:', error);
            tbody.innerHTML = '<tr><td colspan="7">Không thể tải dữ liệu hồ sơ sức khỏe. Vui lòng thử lại.</td></tr>';
        }
    }


    // --- Hàm Render Bảng Mục tiêu ---
    async function renderTargetsTable() {
        const tbody = document.getElementById('targets-table-body');
        if (!tbody) {
            console.error('Không tìm thấy phần tử #targets-table-body trong DOM.');
            return;
        }
        tbody.innerHTML = '';

        try {
            const targetsResponse = await fetch('http://localhost:8286/api/targets');
            if (!targetsResponse.ok) {
                throw new Error(`HTTP error! status: ${targetsResponse.status}`);
            }
            const targets = await targetsResponse.json();

            const usersResponse = await fetch('http://localhost:8286/api/users');
            if (!usersResponse.ok) {
                throw new Error(`HTTP error! status: ${usersResponse.status}`);
            }
            const users = await usersResponse.json();
            const userMap = new Map(users.map(user => [user.userId, user.username]));

            if (targets.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">Không có mục tiêu nào trong hệ thống.</td></tr>';
                return;
            }

            targets.forEach(target => {
                const userName = userMap.get(target.user.userId) || 'Không xác định';
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatTargetId(target.targetId)}</td>
                    <td>${userName}</td>
                    <td>${target.title}</td>
                    <td>${target.status}</td>
                    <td>${target.startDate || ''}</td>
                    <td>${target.endDate || ''}</td>
                    <td>
                        <button class="action-btn btn-edit" data-id="${target.targetId}" data-modal="target-modal">Sửa</button>
                        <button class="action-btn btn-delete" data-id="${target.targetId}" data-type="target">Xóa</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Lỗi khi tải danh sách mục tiêu:', error);
            tbody.innerHTML = '<tr><td colspan="7">Không thể tải dữ liệu mục tiêu. Vui lòng thử lại.</td></tr>';
        }
    }

    // --- Hàm Setup Form Mục tiêu ---
    async function setupTargetForm(id = null) {
        const form = document.getElementById('target-form');
        form.reset();
        document.getElementById('target-modal-title').textContent = id ? 'Sửa mục tiêu' : 'Thêm mục tiêu mới';
        document.getElementById('target-id').value = id || '';

        // Tải danh sách người dùng vào dropdown
        const userSelect = document.getElementById('target-user-id');
        userSelect.innerHTML = '<option value="">Chọn người dùng</option>'; // Reset options
        try {
            const usersResponse = await fetch('http://localhost:8286/api/users');
            if (!usersResponse.ok) {
                throw new Error(`HTTP error! status: ${usersResponse.status}`);
            }
            const users = await usersResponse.json();
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.userId; // userId là Long
                option.textContent = user.username;
                userSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Lỗi khi tải danh sách người dùng cho mục tiêu:', error);
            alert('Không thể tải danh sách người dùng. Vui lòng thử lại.');
            return;
        }

        if (id) {
            try {
                const response = await fetch(`http://localhost:8286/api/targets/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const target = await response.json();
                document.getElementById('target-user-id').value = target.userId; // backend trả về userId trực tiếp
                document.getElementById('target-title').value = target.title;
                document.getElementById('target-status').value = target.status;
                document.getElementById('target-start-date').value = target.startDate || '';
                document.getElementById('target-end-date').value = target.endDate || '';
            } catch (error) {
                console.error('Lỗi khi tải thông tin mục tiêu để sửa:', error);
                alert('Không thể tải thông tin mục tiêu. Vui lòng thử lại.');
                closeModal(document.getElementById('target-modal'));
            }
        }
    }

    // --- Xử lý Submit Form Mục tiêu ---
    document.getElementById('target-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const targetId = document.getElementById('target-id').value;
        // Code đã sửa
        const targetData = {
            user: { // <-- Tạo đối tượng user lồng vào
                userId: parseInt(document.getElementById('target-user-id').value, 10)
            },
            title: document.getElementById('target-title').value,
            status: document.getElementById('target-status').value,
            startDate: document.getElementById('target-start-date').value,
            endDate: document.getElementById('target-end-date').value
        };

        let url = 'http://localhost:8286/api/targets';
        let method = 'POST';

        if (targetId) {
            url = `http://localhost:8286/api/targets/${targetId}`;
            method = 'PUT';
            // Không cần gán targetData.targetId = id; vì id đã có trong URL
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(targetData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            renderAllTables();
            closeModal(document.getElementById('target-modal'));
            alert(targetId ? 'Cập nhật mục tiêu thành công!' : 'Thêm mục tiêu mới thành công!');
        } catch (error) {
            console.error('Lỗi khi lưu mục tiêu:', error);
            alert(`Lỗi khi lưu mục tiêu: ${error.message}. Vui lòng kiểm tra dữ liệu và thử lại.`);
        }
    });


    // --- Hàm Render Bảng Loại Số liệu ---
    async function renderMetricTypesTable() {
        const tbody = document.getElementById('metric-types-table-body');
        if (!tbody) {
            console.error('Không tìm thấy phần tử #metric-types-table-body trong DOM.');
            return;
        }
        tbody.innerHTML = '';

        try {
            const response = await fetch('http://localhost:8286/api/metrics'); // API này trả về MetricType entity
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const metricTypes = await response.json();

            if (metricTypes.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4">Không có loại số liệu nào trong hệ thống.</td></tr>';
                return;
            }

            metricTypes.forEach(metric => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatMetricTypeId(metric.metricId)}</td> <td>${metric.name}</td>
                    <td>${metric.unit}</td>
                    <td>
                        <button class="action-btn btn-edit" data-id="${metric.metricId}" data-modal="metric-type-modal">Sửa</button>
                        <button class="action-btn btn-delete" data-id="${metric.metricId}" data-type="metric">Xóa</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Lỗi khi tải danh sách loại số liệu:', error);
            tbody.innerHTML = '<tr><td colspan="4">Không thể tải dữ liệu loại số liệu. Vui lòng thử lại.</td></tr>';
        }
    }

    // --- Hàm Setup Form Loại Số liệu ---
    async function setupMetricTypeForm(id = null) { // id ở đây là ID gốc (số nguyên Long)
        const form = document.getElementById('metric-type-form');
        form.reset();
        document.getElementById('metric-type-modal-title').textContent = id ? 'Sửa loại số liệu' : 'Thêm loại số liệu mới';

        const metricIdContainer = document.getElementById('metric-id-container');
        const metricIdInput = document.getElementById('metric-id');

        // Lưu ID thật (Long) vào một trường input ẩn để dễ dàng truy cập khi submit
        document.getElementById('metric-type-actual-id').value = id || '';


        if (id) { // Chế độ sửa
            metricIdInput.value = formatMetricTypeId(id); // Hiển thị ID dạng M00X
            metricIdInput.readOnly = true; // Không cho sửa ID
            metricIdContainer.style.display = 'block'; // Hiển thị ô ID

            try {
                const response = await fetch(`http://localhost:8286/api/metrics/${id}`); // Gửi ID số nguyên Long
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const metric = await response.json(); // Nhận về MetricType entity
                document.getElementById('metric-name').value = metric.name;
                document.getElementById('metric-unit').value = metric.unit;
            } catch (error) {
                console.error('Lỗi khi tải thông tin loại số liệu để sửa:', error);
                alert('Không thể tải thông tin loại số liệu. Vui lòng thử lại.');
                closeModal(document.getElementById('metric-type-modal'));
            }
        } else { // Chế độ thêm mới
            metricIdInput.value = ''; // Không có ID để hiển thị
            metricIdInput.readOnly = true; // Backend tự sinh ID
            metricIdContainer.style.display = 'none'; // Ẩn ô ID khi thêm mới
        }
    }

    // --- Xử lý Submit Form Loại Số liệu ---
    document.getElementById('metric-type-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        // Lấy ID thật (Long) từ input ẩn đã lưu trong setupMetricTypeForm
        const idForBackend = document.getElementById('metric-type-actual-id').value;

        const metricData = {
            name: document.getElementById('metric-name').value,
            unit: document.getElementById('metric-unit').value
        };

        let url = 'http://localhost:8286/api/metrics';
        let method = 'POST';

        if (idForBackend) { // Nếu có ID (đang sửa)
            url = `http://localhost:8286/api/metrics/${idForBackend}`; // Gửi ID số nguyên Long
            method = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(metricData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            renderAllTables();
            closeModal(document.getElementById('metric-type-modal'));
            alert(method === 'PUT' ? 'Cập nhật loại số liệu thành công!' : 'Thêm loại số liệu mới thành công!');
        } catch (error) {
            console.error('Lỗi khi lưu loại số liệu:', error);
            alert(`Lỗi khi lưu loại số liệu: ${error.message}. Vui lòng kiểm tra dữ liệu và thử lại.`);
        }
    });


    // --- Hàm Xử lý Xóa Chung ---
    async function handleDelete(id, type) {
        if (!confirm(`Bạn có chắc chắn muốn xóa ${type} này không?`)) {
            return;
        }

        let url = '';
        let successMessage = '';
        let errorMessage = '';

        if (type === 'user') {
            url = `http://localhost:8286/api/users/${id}`;
            successMessage = 'Đã xóa người dùng thành công!';
            errorMessage = 'Lỗi khi xóa người dùng:';
        } else if (type === 'healthrecord') {
            url = `http://localhost:8286/api/healthrecords/${id}`;
            successMessage = 'Đã xóa hồ sơ sức khỏe thành công!';
            errorMessage = 'Lỗi khi xóa hồ sơ sức khỏe:';
        } else if (type === 'target') {
            url = `http://localhost:8286/api/targets/${id}`;
            successMessage = 'Đã xóa mục tiêu thành công!';
            errorMessage = 'Lỗi khi xóa mục tiêu:';
        } else if (type === 'metric') {
            url = `http://localhost:8286/api/metrics/${id}`; // ID ở đây là số nguyên gốc (Long)
            successMessage = 'Đã xóa loại số liệu thành công!';
            errorMessage = 'Lỗi khi xóa loại số liệu:';
        } else {
            console.error('Loại dữ liệu không xác định để xóa:', type);
            alert('Không thể xóa: Loại dữ liệu không xác định.');
            return;
        }

        try {
            const response = await fetch(url, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            alert(successMessage);
            renderAllTables(); // Tải lại tất cả các bảng sau khi xóa
        } catch (error) {
            console.error(errorMessage, error);
            alert(`${errorMessage} ${error.message}.`);
        }
    }


    // --- Hàm Tải lại tất cả các bảng (gọi sau mỗi thao tác thêm/sửa/xóa) ---
    async function renderAllTables() {
        await renderDashboardStats();
        await renderUsersTable();
        await renderHealthRecordsTable();
        await renderTargetsTable();
        await renderMetricTypesTable();
    }

    // --- XỬ LÝ SỰ KIỆN KHÁC ---

    // Xử lý sự kiện click cho các nút Thêm/Sửa/Xóa
    document.addEventListener('click', async (event) => {
        // Nút thêm mới
        if (event.target.matches('.btn-add')) {
            const modalId = event.target.dataset.modal;
            const modal = document.getElementById(modalId);
            openModal(modal);

            if (modalId === 'user-modal') {
                setupUserForm();
            } else if (modalId === 'target-modal') {
                await setupTargetForm();
            } else if (modalId === 'metric-type-modal') {
                setupMetricTypeForm();
            }
        }

        // Nút sửa
        if (event.target.matches('.action-btn.btn-edit')) {
            const id = event.target.dataset.id;
            const modalId = event.target.dataset.modal;
            const modal = document.getElementById(modalId);
            openModal(modal);

            if (modalId === 'user-modal') {
                setupUserForm(id);
            } else if (modalId === 'target-modal') {
                await setupTargetForm(id);
            } else if (modalId === 'metric-type-modal') {
                await setupMetricTypeForm(id); // Truyền ID Long gốc
            }
        }

        // Nút xóa
        if (event.target.matches('.action-btn.btn-delete')) {
            const id = event.target.dataset.id;
            const type = event.target.dataset.type;
            handleDelete(id, type);
        }
    });

    // Đăng xuất
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Bạn có muốn đăng xuất không?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser'); // Thêm dòng này để xóa username đã lưu
            window.location.href = 'login.html';
        }
    });

}); // Kết thúc DOMContentLoaded