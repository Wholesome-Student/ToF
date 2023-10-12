document.getElementById("rules").onclick = async (e) => {
    e.preventDefault();
    document.location.assign('rules.html');
}

document.getElementById("settings").onclick = async (e) => {
    e.preventDefault();
    document.location.assign('settings.html');
}

document.getElementById("home").onclick = async (e) => {
    e.preventDefault();
    document.location.assign('index.html');
}

document.getElementById("map").onclick = async (e) => {
    e.preventDefault();
    document.location.assign('map.html');
}

// document.getElementById("rules").onclick = async (e) => {
//   e.preventDefault();
//   const msg = document.getElementById("msg").value;

//   const response = await fetch("/hello",{
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({
//       msg: msg
//     })
//   });
//   document.getElementById("title").innerText = await response.text();
// }