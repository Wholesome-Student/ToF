let inputText = document.getElementById("writeText");
    const writeButton = document.getElementById("writeButton");
    const readButton = document.getElementById("readButton");
    const log = document.getElementById("log");

    writeButton.addEventListener("click", async () => {
    console.log("write button clicked");
    log.textContent = await "please touch the NFC tag!";
    try {
        let writeText = inputText.value
        console.log(writeText)
        if (!writeText) {
        log.textContent = "empty";
        return;
        }
        const reader = new NDEFReader();
        await reader.write(writeText);
        log.textContent = `write: ${writeText}`;
    } catch (error) {
        log.textContent = error;
        console.log(error);
    }
    });
    readButton.addEventListener("click", async () => {
        log.textContent = await "clicked read button";
        try {
            const reader = new NDEFReader();
            await reader.scan();
            log.textContent = "scan started";

            reader.addEventListener("error", () => {
            console.log("Error");
            });

            reader.addEventListener("reading", ({ message, serialNumber }) => {
            console.log(`> Serial Number: ${serialNumber}`);
            console.log(message);
            const record = message.records[0];
            const { data, encoding, recordType } = record;
            if (recordType === "text") {
                const textDecoder = new TextDecoder(encoding);
                const text = textDecoder.decode(data);
                log.textContent = text;
            }
            });
        } catch (error) {
            log.textContent = error;
        }
    });