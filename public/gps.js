window.onload = async () => {
    if ('geolocation' in navigator) {
        const geolocation = navigator.geolocation;
        geolocation.getCurrentPosition((position) => {
            const gps_latitude = position.coords.latitude;
            const gps_longitude = position.coords.longitude;
            document.getElementById("location").innerText = gps_latitude + ", " + gps_longitude;
        });
    } else {
        console.error('this browser has not support geolocation.');
    }
}