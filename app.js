// Language toggle (visual only)
document.querySelectorAll('.lang').forEach((b) => {
    b.addEventListener('click', () => {
        document.querySelectorAll('.lang').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        // In a real app you'd swap localized strings here.
    });
});

// Membership dialog
const dlgMember = document.getElementById('dlgMember');
document.getElementById('memberBtn').onclick = () => dlgMember.showModal();
document.getElementById('saveMember').onclick = () => {
    const v = document.getElementById('memberInput').value.trim();
    if (!v) {
        alert('Please enter a membership number.');
        return;
    }
    alert('Membership linked: ' + v);
    dlgMember.close();
};

// Help dialog
const dlgHelp = document.getElementById('dlgHelp');
document.getElementById('helpBtn').onclick = () => dlgHelp.showModal();
document.getElementById('inlineHelp').onclick = () => dlgHelp.showModal();

// Generic close buttons for dialogs
document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => btn.closest('dialog').close());
});

// Fake "Ready to Scan" action
document.getElementById('scanBtn').addEventListener('click', (event) => {
    const btn = event.currentTarget;
    btn.style.transform = 'scale(.98)';
    setTimeout(() => (btn.style.transform = ''), 120);

    // simple toast
    const n = document.createElement('div');
    n.textContent = 'Scanner initialized — start scanning!';
    Object.assign(n.style, {
        position: 'fixed',
        left: '50%',
        top: '24px',
        transform: 'translateX(-50%)',
        background: '#111827',
        color: '#fff',
        padding: '10px 14px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(2,6,23,.18)',
        zIndex: 99
    });
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2200);
});

// Accessibility button (demo)
document.getElementById('accessBtn').addEventListener('click', () => {
    document.body.style.fontSize = '18px';
    alert('Accessibility mode: larger base font size applied.');
});
