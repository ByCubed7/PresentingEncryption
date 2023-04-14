function copyValue(elementId) {
    // Get the text field
    var element = document.getElementById(elementId);

    // Copy the text
    navigator.clipboard.writeText(element.innerHTML);
}


class Input {
    constructor(data, key, salt, iv) {
        this.data   = data;
        this.key    = key;
        this.salt   = salt;
        this.iv     = iv;
    }

    cyptoKey() {
        return CryptoJS.PBKDF2(
            this.key,
            this.salt,
            { keySize: this.keySize, iterations: this.iterationCount }
        );
    }
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const eleData   = document.getElementById("data");
const eleKey    = document.getElementById("key");
const eleSalt   = document.getElementById("salt");
const eleIV     = document.getElementById("iv");
const eleIter   = document.getElementById("iter");
const eleDecr   = document.getElementById("decrypt");

const paramString = window.location.href.split('?')[1];
const URLParams = new URLSearchParams(paramString);

// Fill URLParams
eleData.value   = URLParams.get("data");
eleKey.value    = URLParams.get("key");
eleSalt.value   = URLParams.get("salt");
eleIV.value     = URLParams.get("iv");
eleIter.value   = URLParams.get("iter");
eleDecr.checked = URLParams.get("decrypt") == "true";

eleData.addEventListener('input', update);
eleKey .addEventListener('input', update);
eleSalt.addEventListener('input', update);
eleIV  .addEventListener('input', update);
eleIter.addEventListener('input', update);
eleDecr.addEventListener('input', update);

// Set defaults
CryptoJS.pad.NoPadding = {pad: function(){}, unpad: function(){}};
encrypt = CryptoJS.AES.encrypt("thing", "password");
eleData.value   = eleData.value !== '' ? eleData.value    : "data";
eleKey.value    = eleKey.value  !== '' ? eleKey.value     : "key";
eleSalt.value   = eleSalt.value !== '' ? eleSalt.value    : encrypt.salt;
eleIV.value     = eleIV.value   !== '' ? eleIV.value      : encrypt.iv.toString();
eleIter.value   = eleIter.value !== '' ? eleIter.value    : 3;


window.onload = update;

function update() {
    document.getElementById("MD5").innerHTML        = CryptoJS.MD5(data);
    document.getElementById("SHA1").innerHTML       = CryptoJS.SHA1(data);
    document.getElementById("SHA256").innerHTML     = CryptoJS.SHA256(data);
    document.getElementById("SHA512").innerHTML     = CryptoJS.SHA512(data);
    document.getElementById("SHA3").innerHTML       = CryptoJS.SHA3(data);
    document.getElementById("RIPEMD160").innerHTML  = CryptoJS.RIPEMD160(data);

    if (eleDecr.checked) {
        set("AES", CryptoJS.AES.decrypt, true);
        set("DES", CryptoJS.DES.decrypt, true);
        set("Rabbit", CryptoJS.Rabbit.decrypt, true);
        set("RC4", CryptoJS.RC4.decrypt, true);
    } else {
        set("AES", CryptoJS.AES.encrypt);
        set("DES", CryptoJS.DES.encrypt);
        set("Rabbit", CryptoJS.Rabbit.encrypt);
        set("RC4", CryptoJS.RC4.encrypt);
    }

    // Construct URLSearchParams object instance from current URL querystring
    let queryParams = new URLSearchParams(window.location.search);

    // Set new or modify existing page value
    queryParams.set("data", eleData.value);
    queryParams.set("key",  eleKey.value);
    queryParams.set("salt", eleSalt.value);
    queryParams.set("iv",   eleIV.value);
    queryParams.set("iter", eleIter.value);
    queryParams.set("decrypt", eleDecr.checked);

    // Replace current querystring with the new one
    history.replaceState(null, null, "?" + queryParams.toString());
}

function set(elementId, functi, parse = false) {

    // Get the element from id
    element = document.getElementById(elementId);

    // Run the encryption / decryption method
    var result;
    try {
        var data = eleData.value;

        var iv = eleIV.value;
        var parsedIV = CryptoJS.enc.Hex.parse(iv);

        var cryptoKey = CryptoJS.PBKDF2(
            eleKey.value, eleSalt.value,
            //{ keySize: keySize, iterations: iterationCount }
            { iterations: eleIter.value }
        );

        result = functi(data, cryptoKey, { iv: parsedIV });
    } catch {
        element.innerHTML = "Failed to execute";
        return;
    }

    // Parse Utf8 value
    if (parse)
    try   { result = result.toString(CryptoJS.enc.Utf8); }
    catch {
        element.innerHTML = "Not Utf8 parsable";
        return;
    }

    element.innerHTML = result;
}









var fileInput = document.getElementById("upload");
fileInput.addEventListener('change', loadData);

function loadData(e) {

    if (!fileInput.files) return;
    if (fileInput.files.length <= 0) return;

    var file = fileInput.files[0];
    var reader = new FileReader();

    fileInput.value = "";
    reader.onload = function(e) {
         eleData.value = reader.result;
         update();
    };

    reader.readAsText(file);
}



















//
