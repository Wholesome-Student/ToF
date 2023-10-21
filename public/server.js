const ranking = await fetch("/rank", {
    method: 'POST',
    headers: {'Content-Type': 'text/plain'},
    body: null
});

if (ranking.status === 200) {
    const json = await ranking?.json();
    console.log(JSON.stringify(json));
    for (let i=0;i<3;i++) {
        document.getElementById("username-"+String(i+1)).innerText = json[i]["username"];
        document.getElementById("point-"+String(i+1)).innerText = json[i]["point"] + " pt";
    }
}


// [HOME]
document.getElementById('home').onclick = async (e) => {
    e.preventDefault();
    document.location.assign('./home.html');
}

// [ITEM]
document.getElementById("item").onclick = async (e) => {
    e.preventDefault();
    document.getElementById('item-mordal').classList.toggle('open');
    if (document.getElementById('other-mordal').classList.contains('open')) {
        document.getElementById('other-mordal').classList.toggle('open');
    }
}

// [OTHER]
document.getElementById("other").onclick = async (e) => {
    e.preventDefault();
    document.getElementById('other-mordal').classList.toggle('open');
    if (document.getElementById('item-mordal').classList.contains('open')) {
        document.getElementById('item-mordal').classList.toggle('open');
    }
}