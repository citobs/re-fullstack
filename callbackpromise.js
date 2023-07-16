

function delay(sec, callback) {
    setTimeout(() => {
        callback(new Date().toISOString());
    }, sec*1000);
}