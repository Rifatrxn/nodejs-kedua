const form=document.getElementById('form'),list=document.getElementById('list');
async function load(){const d=await(await fetch('/api/todos')).json();
list.innerHTML=d.map(t=>`<div class="todo"><span class="${t.selesai?'done':''}">${t.judul}</span><div class="row"><button onclick="toggle('${t.id}')">${t.selesai?'Batal':'Selesai'}</button><button class="del" onclick="hapus('${t.id}')">Hapus</button></div></div>`).join('')||'<p>Belum ada tugas.</p>'}
form.onsubmit=async e=>{e.preventDefault();const judul=document.getElementById('judul').value;
await fetch('/api/todos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({judul})});form.reset();load()};
async function toggle(id){await fetch('/api/todos/'+id,{method:'PUT'});load()}
async function hapus(id){await fetch('/api/todos/'+id,{method:'DELETE'});load()}
load();
