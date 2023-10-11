document.getElementById("greeting").onclick = async (e) => {
    e.preventDefault();
    const msg = document.getElementById("msg").value;
  
    const response = await fetch("/hello",{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        msg: msg
      })
    });
    document.getElementById("title").innerText = await response.text();
}