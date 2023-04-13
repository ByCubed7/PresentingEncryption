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
const eleIter     = document.getElementById("iter");

const paramString = window.location.href.split('?')[1];
const URLParams = new URLSearchParams(paramString);

// Fill URLParams
eleData.value   = URLParams.get("data");
eleKey.value    = URLParams.get("key");
eleSalt.value   = URLParams.get("salt");
eleIV.value     = URLParams.get("iv");
eleIter.value     = URLParams.get("iter");

eleData.addEventListener('input', update);
eleKey .addEventListener('input', update);
eleSalt.addEventListener('input', update);
eleIV  .addEventListener('input', update);
eleIter.addEventListener('input', update);

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
    var data = eleData.value;

    var iv = eleIV.value;
    var parsedIV = CryptoJS.enc.Hex.parse(iv);

    var cryptoKey = CryptoJS.PBKDF2(
        eleKey.value,
        eleSalt.value,
        //{ keySize: keySize, iterations: iterationCount }
        { iterations: eleIter.value }
    );

    document.getElementById("MD5").innerHTML = CryptoJS.MD5(data);
    document.getElementById("SHA1").innerHTML = CryptoJS.SHA1(data);
    document.getElementById("SHA256").innerHTML = CryptoJS.SHA256(data);
    document.getElementById("SHA512").innerHTML = CryptoJS.SHA512(data);
    document.getElementById("SHA3").innerHTML = CryptoJS.SHA3(data);
    document.getElementById("RIPEMD160").innerHTML = CryptoJS.RIPEMD160(data);

    document.getElementById("AES").innerHTML = CryptoJS.AES.encrypt(data, cryptoKey, { iv: parsedIV });
    document.getElementById("DES").innerHTML = CryptoJS.DES.encrypt(data, cryptoKey, { iv: parsedIV });
    //document.getElementById("TripleDES").innerHTML = CryptoJS.TripleDES.encrypt(data, cryptoKey, { iv: parsedIV });
    document.getElementById("Rabbit").innerHTML = CryptoJS.Rabbit.encrypt(data, cryptoKey, { iv: parsedIV });
    document.getElementById("RC4").innerHTML = CryptoJS.RC4.encrypt(data, cryptoKey, { iv: parsedIV });


    // Construct URLSearchParams object instance from current URL querystring
    let queryParams = new URLSearchParams(window.location.search);

    // Set new or modify existing page value
    queryParams.set("data", eleData.value);
    queryParams.set("key",  eleKey.value);
    queryParams.set("salt", eleSalt.value);
    queryParams.set("iv",   eleIV.value);
    queryParams.set("iter",   eleIter.value);

    // Replace current querystring with the new one
    history.replaceState(null, null, "?" + queryParams.toString());
}
























//
