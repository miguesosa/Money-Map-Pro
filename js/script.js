document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();

    try {
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value.trim()).toFixed(2);
        const type = document.getElementById('type').value;

        if (description === '' || isNaN(amount) || amount <= 0) {
            throw new Error('Por favor, completa correctamente todos los campos.');
        }

        addTransaction(description, parseFloat(amount), type);
        updateStats();
        updateLocalStorage();
        renderTransactions();
        showAlert('Transacción añadida con éxito.', 'success');

        document.getElementById('form').reset();

    } catch (error) {
        showAlert(error.message, 'error');
    }
});

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction(description, amount, type) {
    const transaction = {
        id: Date.now(),
        description,
        amount,
        type
    };
    transactions.push(transaction);
}

function renderTransactions() {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        
        li.innerHTML = `
            <div>
                <strong>${transaction.description}</strong><br>
                <small class="text-muted">${transaction.type === 'income' ? 'Ingreso' : 'Gasto'}</small>
            </div>
            <div>
                <span class="${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
                    $${transaction.amount.toFixed(2)}
                </span>
                <button class="btn btn-danger btn-sm ms-3" onclick="removeTransaction(${transaction.id})">Eliminar</button>
            </div>
        `;

        transactionList.appendChild(li);

        setTimeout(() => li.classList.add('show'), 100);
    });
}

function removeTransaction(id) {
    const confirmation = confirm("¿Estás seguro de que deseas eliminar esta transacción?");
    if (confirmation) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateStats();
        updateLocalStorage();
        renderTransactions();
        showAlert('Transacción eliminada con éxito.', 'success');
    }
}

function updateStats() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    document.getElementById('total-income').textContent = `Total Ingresos: $${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `Total Gastos: $${totalExpenses.toFixed(2)}`;
    document.getElementById('balance').textContent = `Balance: $${balance.toFixed(2)}`;
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
    alertDiv.textContent = message;

    const formContainer = document.getElementById('transaction-form');
    formContainer.appendChild(alertDiv);

    setTimeout(() => alertDiv.classList.add('show'), 100);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

renderTransactions();
updateStats();
