document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    addTransaction(description, amount, type);
    updateStats();
    updateLocalStorage();
    renderTransactions();
});

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction(description, amount, type) {
    const transaction = {
        id: transactions.length + 1,
        description,
        amount,
        type
    };
    transactions.push(transaction);
    renderTransactions();
}

function renderTransactions() {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.textContent = `${transaction.description}: $${transaction.amount} (${transaction.type})`;
        transactionList.appendChild(li);
    });
}

function updateStats() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    document.getElementById('total-income').textContent = `Total Ingresos: $${totalIncome}`;
    document.getElementById('total-expenses').textContent = `Total Gastos: $${totalExpenses}`;
    document.getElementById('balance').textContent = `Balance: $${balance}`;
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Inicializar la aplicación
renderTransactions();
updateStats();
