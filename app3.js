const CATALOG = [
    { id:'t1', title:'Fresh Tomatoes', price:2.99, unit:'/ lb', cat:'vegetables'}
    ,
    { id:'c2', title:'Organic Carrots', price:1.99, unit:'/ lb', cat:'vegetables',
        },
    { id:'l3', title:'Fresh Lettuce', price:3.49, unit:'/ each', cat:'vegetables',
         },
    { id:'b1', title:'Bananas', price:0.79, unit:'/ lb', cat:'fruits',
         },
    { id:'a2', title:'Red Apples', price:3.99, unit:'/ lb', cat:'fruits',
         },
    { id:'o3', title:'Fresh Oranges', price:4.49, unit:'/ lb', cat:'fruits',
        }
];

let CART = [];
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const fmt = n => '$' + n.toFixed(2);

function renderProducts(filter='all', q=''){
    const container = $('#products');
    container.innerHTML='';
    const ql=q.trim().toLowerCase();
    const list=CATALOG.filter(p=>{
        const catOK=filter==='all'?true:p.cat===filter;
        const textOK=ql===''?true:(p.title.toLowerCase().includes(ql)||p.id.includes(ql));
        return catOK&&textOK;
    });

    list.forEach(p=>{
        const card=document.createElement('div');card.className='card';
        card.innerHTML=`
      <div class="media" style="background-image:url('${p.img}')">
        <div class="badge">${p.cat.charAt(0).toUpperCase()+p.cat.slice(1)}</div>
      </div>
      <div class="body">
        <div class="title">${p.title}</div>
        <div class="meta">${fmt(p.price)} ${p.unit}</div>
        <div class="actions">
          <div></div>
          <button class="btn primary add-btn" data-id="${p.id}">+ Add</button>
        </div>
      </div>`;
        container.appendChild(card);
    });

    $$('.add-btn').forEach(b=>b.addEventListener('click',e=>{
        const id=e.currentTarget.dataset.id;
        const prod=CATALOG.find(x=>x.id===id);
        addToCart(prod);
    }));
}

function addToCart(prod,qty=1){
    const line=CART.find(l=>l.id===prod.id);
    if(line) line.qty+=qty;
    else CART.push({id:prod.id,title:prod.title,price:prod.price,qty});
    renderCart();
}
function removeFromCart(id){CART=CART.filter(l=>l.id!==id);renderCart();}
function changeQty(id,delta){
    const line=CART.find(l=>l.id===id);
    if(!line)return;
    line.qty=Math.max(0,line.qty+delta);
    if(line.qty===0)removeFromCart(id);else renderCart();
}

function renderCart(){
    const content=$('#cartContent');
    content.innerHTML='';
    if(CART.length===0){
        content.innerHTML='<div class="empty">Your cart is empty</div>';
    }else{
        CART.forEach(line=>{
            const div=document.createElement('div');div.className='line';
            div.innerHTML=`
        <div>
          <div style="font-weight:700">${line.title}</div>
          <div style="color:#667085;font-size:13px">${fmt(line.price)} each</div>
        </div>
        <div style="text-align:right">
          <div class="qty-control">
            <button onclick="changeQty('${line.id}',-1)">−</button>
            <div style="padding:6px 8px">${line.qty}</div>
            <button onclick="changeQty('${line.id}',1)">+</button>
          </div>
          <div style="margin-top:6px;font-weight:700">${fmt(line.price*line.qty)}</div>
          <div style="margin-top:6px"><button class="btn ghost" onclick="removeFromCart('${line.id}')">Remove</button></div>
        </div>`;
            content.appendChild(div);
        });
    }

    const subtotal=CART.reduce((s,l)=>s+l.price*l.qty,0);
    const tax=subtotal*0.08;
    const total=subtotal+tax;
    $('#subtotal').textContent=fmt(subtotal);
    $('#tax').textContent=fmt(tax);
    $('#total').textContent=fmt(total);
}

let activeCategory='all';
$$('.tab').forEach(t=>{
    t.addEventListener('click',()=>{
        $$('.tab').forEach(x=>x.classList.remove('active'));
        t.classList.add('active');
        activeCategory=t.dataset.cat;
        renderProducts(activeCategory,$('#search').value);
    });
});
$('#search').addEventListener('input',e=>{
    renderProducts(activeCategory,e.target.value);
});
$('#checkoutBtn').addEventListener('click',()=>{
    if(CART.length===0){alert('Cart is empty');return;}
    alert('Checkout demo — total '+$('#total').textContent);
    CART=[];renderCart();
});
renderProducts();renderCart();
