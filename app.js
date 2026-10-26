const DEFAULTS={email:"ibrahinhossen62850@gmail.com",pay:"01991545695",packages:[["100 Diamonds",0],["310 Diamonds",0],["520 Diamonds",0],["1060 Diamonds",0]]};
let settings=load("ff_settings",DEFAULTS), orders=load("ff_orders",[]), selected=0;
const $=id=>document.getElementById(id);
function load(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function toast(t){$("toast").textContent=t;$("toast").classList.remove("hidden");setTimeout(()=>$("toast").classList.add("hidden"),2600)}
function renderPackages(){const root=$("packages");root.innerHTML="";settings.packages.forEach((p,i)=>{let b=document.createElement("button");b.type="button";b.className="package"+(selected===i?" selected":"");b.innerHTML=`<strong>${esc(p[0])}</strong><span>${Number(p[1])>0?"৳"+Number(p[1]).toFixed(0):"Price soon"}</span><small>UID top-up</small>`;b.onclick=()=>{selected=i;renderPackages()};root.appendChild(b)});$("payNumber").textContent=settings.pay}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("year").textContent=new Date().getFullYear();
$("copyNumber").onclick=async()=>{try{await navigator.clipboard.writeText(settings.pay);toast("bKash number copied")}catch{toast("bKash number: "+settings.pay)}};
$("orderForm").addEventListener("submit",e=>{e.preventDefault();const p=settings.packages[selected];if(!p||Number(p[1])<=0){toast("Admin demo settings থেকে আগে প্যাকেজের দাম সেট করুন।");return}
const o={id:"FF"+Date.now().toString().slice(-8),uid:$("uid").value.trim(),whatsapp:$("whatsapp").value.trim(),method:$("paymentMethod").value,trx:$("trx").value.trim(),amount:$("amount").value,package:p[0],price:p[1],status:"Pending verification",created:new Date().toLocaleString()};orders.unshift(o);save("ff_orders",orders);e.target.reset();toast("ডেমো অর্ডার এই ডিভাইসে সংরক্ষিত হয়েছে।")});
$("openAdmin").onclick=()=>{$("adminModal").classList.remove("hidden");$("adminEmail").value=settings.email;$("adminPay").value=settings.pay;$("adminPackages").value=settings.packages.map(p=>p[0]+"|"+p[1]).join("\n");renderOrders()};
$("closeAdmin").onclick=()=>$("adminModal").classList.add("hidden");
$("adminModal").addEventListener("click",e=>{if(e.target===$("adminModal"))$("adminModal").classList.add("hidden")});
$("settingsForm").addEventListener("submit",e=>{e.preventDefault();const ps=$("adminPackages").value.split("\n").map(x=>x.split("|")).filter(x=>x[0]&&x.length>1).map(x=>[x[0].trim(),Math.max(0,Number(x[1])||0)]);if(!ps.length){toast("কমপক্ষে একটি প্যাকেজ দিন");return}settings={email:$("adminEmail").value.trim(),pay:$("adminPay").value.trim(),packages:ps};save("ff_settings",settings);renderPackages();toast("এই ডিভাইসে demo settings save হয়েছে");});
function renderOrders(){$("ordersList").innerHTML=orders.length?orders.map(o=>`<div class="order"><b>${esc(o.id)} · ${esc(o.package)}</b><br>UID: ${esc(o.uid)} · WhatsApp: ${esc(o.whatsapp)}<br>Txn: ${esc(o.trx)} · ৳${esc(o.amount)}<br><small>${esc(o.created)} · ${esc(o.status)}</small></div>`).join(""):"এখনো কোনো ডেমো অর্ডার নেই।"}
$("clearOrders").onclick=()=>{orders=[];save("ff_orders",orders);renderOrders();toast("ডেমো অর্ডার মুছে ফেলা হয়েছে")};
renderPackages();