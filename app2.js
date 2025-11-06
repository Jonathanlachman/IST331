// --- Demo "database" of items -----------------------------------------------
const CATALOG = [
    { id: '001', name: 'Bananas (per lb)', price: 0.59, unit: 'lb', byWeight: true },
    { id: '002', name: 'Organic Apples', price: 3.99 },
    { id: '003', name: 'Whole Milk (1 gal)', price: 4.49 },
    { id: '004', name: 'White Bread', price: 2.99 },
    { id: '005', name: 'Eggs (12 ct)', price: 3.49 },
    { id: '006', name: 'Orange Juice', price: 4.99 },
    { id: '007', name: 'Potato Chips', price: 3.79 },
    { id: '008', name: 'Tomatoes (per lb)', price: 1.99, unit: 'lb', byWeight: true },
    { id: '009', name: 'Cereal Box', price: 3.89 },
    { id: '010', name: 'Ground Coffee', price: 6.99 }
];

// --- State -------------------------------------------------------------------
const state = {
    cart: [] // { id, name, price, qty, byWeight, unit }
};

// --- Helpers -----------------------------------------------------------------
const fmt = (n) => `$${n.toFixed(2)}`;

function renderQuickList() {
    const wrap = document.getElementById('quickList');
    wrap.innerHTML = '';
    CATALOG.forEach(item => {
        const div = document.createElement('button');
        div.className = 'qa-item';
        div.innerHTML = `
      <div class="qa-id">#${item.id}</div>
      <div class="qa-name">${item.name}</div>
      <div class="qa-price">${fmt(item.price)}${item.byWeight ? ' / lb' : ''}</div>
    `;
        div.addEventListener('click', () => handleAddFromQuick(item));
        wrap.appendChild(div);
    });
}

function addToCart(item, qty = 1, customPrice = null) {
    const key = item.id + (customPrice ? `@${customPrice}` : ''); // separate weighed prices
    let line = state.cart.find(x => x.key === key);
    if (!line) {
        line = { key, id: item.id, name: item.name, price: customPrice ?? item.price, qty: 0, byWeight: !!item.byWeight, unit: item.unit || '' };
        state.cart.push(line);
    }
    line.qty += qty;
    renderCart();
}

function removeFromCart(key) {
    const idx = state.cart.findIndex(x => x.key === key);
    if (idx >= 0) {
        state.cart.splice(idx, 1);
        renderCart();
    }
}

function renderCart() {
    const empty = document.getElementById('emptyCart');
    const list = document.getElementById('cartList');
    const countEl = document.getElementById('itemCount');
    const totalEl = document.getElementById('grandTotal');

    if (state.cart.length === 0) {
        empty.style.display = 'grid';
        list.innerHTML = '';
        countEl.textContent = '0 items';
        totalEl.textContent = '$0.00';
        return;
    }

    empty.style.display = 'none';
    list.innerHTML = '';

    let itemsCount = 0;
    let grand = 0;

    state.cart.forEach(line => {
        const li = document.createElement('li');
        li.className = 'cart-item';

        const meta = document.createElement('div');
        meta.className = 'cart-meta';
        meta.innerHTML = `
      <div class="cart-name">${line.name}</div>
      <div class="cart-sub">${fmt(line.price)}${line.byWeight ? (line.unit ? ' / ' + line.unit : '') : ''}</div>
    `;

        const amt = document.createElement('div');
        amt.className = 'cart-amt';

        const qty = document.createElement('div');
        qty.className = 'qty';
        const minus = document.createElement('button');
        const plus = document.createElement('button');
        minus.textContent = '−';
        plus.textContent = '+';
        const val = document.createElement('span');
        val.textContent = line.qty;
        minus.onclick = () => {
            line.qty--;
            if (line.qty <= 0) removeFromCart(line.key);
            else renderCart();
        };
        plus.onclick = () => { line.qty++; renderCart(); };
        qty.append(minus, val, plus);

        const del = document.createElement('button');
        del.className = 'btn';
        del.textContent = 'Remove';
        del.onclick = () => removeFromCart(line.key);

        const lineTotal = document.createElement('div');
        lineTotal.className = 'line-total';
        lineTotal.textContent = fmt(line.qty * line.price);

        amt.append(qty, del, lineTotal);

        li.append(meta, amt);
        list.appendChild(li);

        itemsCount += line.qty;
        grand += line.qty * line.price;
    });

    countEl.textContent = `${itemsCount} ${itemsCount === 1 ? 'item' : 'items'}`;
    totalEl.textContent = fmt(grand);
}

// --- Interactions ------------------------------------------------------------
function handleAddFromQuick(item) {
    if (item.byWeight) {
        // open weigh dialog with item prefilled
        document.getElementById('weighCode').value = item.id;
        document.getElementById('weighLbs').value = '';
        document.getElementById('dlgWeigh').showModal();
        document.getElementById('dlgWeigh').dataset.prefill = '1';
    } else {
        addToCart(item, 1);
    }
}

function openFind() {
    const dlg = document.getElementById('dlgFind');
    const input = document.getElementById('findInput');
    const list = document.getElementById('findResults');
    input.value = '';
    list.innerHTML = '';
    dlg.showModal();

    function render(q) {
        list.innerHTML = '';
        const term = q.trim().toLowerCase();
        CATALOG.filter(i => i.name.toLowerCase().includes(term) || i.id.includes(term))
            .forEach(i => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>#${i.id}</strong> — ${i.name} <span>${fmt(i.price)}${i.byWeight ? ' / lb' : ''}</span>`;
                li.onclick = () => { dlg.close(); handleAddFromQuick(i); };
                list.appendChild(li);
            });
    }
    input.oninput = () => render(input.value);
    render('');
}

function lookupBarcode() {
    const val = document.getElementById('barcode').value.trim();
    if (!val) { alert('Enter a barcode or PLU.'); return; }
    const item = CATALOG.find(i => i.id === val);
    if (!item) { alert('Item not found in demo catalog.'); return; }
    handleAddFromQuick(item);
    document.getElementById('barcode').value = '';
}

function openWeigh() {
    document.getElementById('weighCode').value = '';
    document.getElementById('weighLbs').value = '';
    document.getElementById('dlgWeigh').removeAttribute('data-prefill');
    document.getElementById('dlgWeigh').showModal();
}

function addWeighed() {
    const code = document.getElementById('weighCode').value.trim();
    const weight = parseFloat(document.getElementById('weighLbs').value);
    const item = CATALOG.find(i => i.id === code && i.byWeight);

    if (!item) { alert('Enter a valid PLU/code for a by-weight item.'); return; }
    if (!(weight > 0)) { alert('Enter a valid weight in pounds.'); return; }

    const linePrice = item.price * weight;
    // store as one unit with computed price (e.g., 1 weighed bag)
    addToCart(item, 1, parseFloat(linePrice.toFixed(2)));
    document.getElementById('dlgWeigh').close();
}

// --- Wire up -----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    renderQuickList();
    renderCart();

    // dialogs' generic close
    document.querySelectorAll('[data-close]').forEach(btn =>
        btn.addEventListener('click', () => btn.closest('dialog').close())
    );

    document.getElementById('lookup').addEventListener('click', lookupBarcode);
    document.getElementById('barcode').addEventListener('keydown', (e)=>{
        if(e.key==='Enter') lookupBarcode();
    });

    document.getElementById('weighBtn').addEventListener('click', openWeigh);
    document.getElementById('weighAdd').addEventListener('click', addWeighed);

    document.getElementById('findBtn').addEventListener('click', openFind);

    document.getElementById('helpBtn').addEventListener('click', ()=> document.getElementById('dlgHelp').showModal());
    document.getElementById('accessBtn').addEventListener('click', ()=>{
        document.body.style.fontSize = '18px';
        alert('Accessibility: larger base font applied.');
    });

    document.getElementById('payBtn').addEventListener('click', ()=>{
        const total = document.getElementById('grandTotal').textContent;
        alert(`Proceeding to payment… Total is ${total}`);
    });
    document.getElementById('cancelBtn').addEventListener('click', ()=>{
        if(confirm('Cancel the transaction and clear the cart?')){
            state.cart = [];
            renderCart();
        }
    });
});
