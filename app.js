import * as THREE from 'three';
import {characters, locations} from './data.js';

/* -------- NAV -------- */
window.showPage = function(id){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById(id).classList.add('active');
}

/* -------- GLOBE -------- */
const canvas = document.getElementById('globe');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45,2,0.1,100);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(canvas.clientWidth,400);

const earth = new THREE.Mesh(
new THREE.SphereGeometry(1,64,64),
new THREE.MeshBasicMaterial({
map:new THREE.TextureLoader().load(
'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg')
})
);
scene.add(earth);

function animate(){
requestAnimationFrame(animate);
earth.rotation.y += 0.002;
renderer.render(scene,camera);
}
animate();

/* CLICK LOCATIONS */
canvas.onclick = ()=>{
const loc = locations[Math.floor(Math.random()*locations.length)];
document.getElementById("infoBox").innerText =
loc.name + " - " + loc.info;
};

/* -------- UNIVERSE PAGE -------- */
function openUniverse(name){
showPage("universe");
const div = document.getElementById("universe");

const heroes = characters.filter(c=>c.universe===name);

div.innerHTML = `
<h2>${name}</h2>
${heroes.map(h=>`<div>${h.name}</div>`).join("")}
`;
}

/* -------- BATTLE -------- */
let selected = [];

const fightersDiv = document.getElementById("fighters");

characters.forEach(c=>{
let div = document.createElement("div");
div.className="fighter";
div.innerText = c.name;

div.onclick = ()=>{
if(selected.length<2){
selected.push(c);
div.classList.add("selected");
}
};

fightersDiv.appendChild(div);
});

window.startBattle = function(){
if(selected.length<2) return;

let [a,b] = selected;

let log = "";

while(a.hp>0 && b.hp>0){
b.hp -= a.attack;
if(b.hp<=0){ log += a.name+" wins"; break;}
a.hp -= b.attack;
if(a.hp<=0){ log += b.name+" wins"; break;}
}

document.getElementById("battleLog").innerText = log;
selected = [];
}

/* -------- MARKET -------- */
window.addItem = function(){
let t = document.getElementById("title").value;
let p = document.getElementById("price").value;

let items = JSON.parse(localStorage.getItem("items")||"[]");

items.push({t,p});
localStorage.setItem("items",JSON.stringify(items));

renderMarket();
};

function renderMarket(){
let items = JSON.parse(localStorage.getItem("items")||"[]");

document.getElementById("marketList").innerHTML =
items.map(i=>`<div>${i.t} - $${i.p}</div>`).join("");
}
renderMarket();
