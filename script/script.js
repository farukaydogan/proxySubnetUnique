var doneCounter = 0;
var ipList = [];
var percentCounter = 0;
var uniqueIps = [];
var timeout = 180;
var id ;

async function loadOk() {
    var loader = document.getElementById("Js_load");
    var bar = loader.querySelector(".j_loadtext");
    bar.innerHTML = "100%";
    loader.className = "loading active";//After adding to 100%, turn off the loading effect

    uniqueIps = await uniqueIpFilter();
    createDonePercentIndexHtml()
    document.getElementById('textdata').value = '';
    for (i in uniqueIps) {
        document.getElementById('textdata').value += uniqueIps[i].proxy + '\n';
    }
    clearInterval(id)
    setTimeout(function () {
        loader.style.display = "none";
    }, 500);
    var element = document.getElementById("Js_load");
    element.parentNode.removeChild(element);

}

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function startEdit() {
    var ips = document.getElementById('textdata').value;
    return stringToArrayLine(ips);
}

async function stringToArrayLine(ips) {

    var arrayDatas = ips.split("\n");
    var objectIpsPortUsernamePass = [];
    for (var i = 0; i < arrayDatas.length; i++) {
        objectIpsPortUsernamePass[i] = arrayDatas[i].split(':');
    }
    return objectIpsPortUsernamePass
}

async function uniqueIpFilter() {
    var unique = [];
    for (var i = 0; i < ipList.length; i++) {
        var found = false;

        for (var j = 0; j < unique.length; j++) { // j < is missed;
            if (ipList[i].ip.substr(0, 7) == unique[j].ip.substr(0, 7)) {
                found = true;
                break;
            }
        }
        if (found == false) {
            unique.push({ip: ipList[i].ip, proxy: ipList[i].proxy});
        }
    }
    return unique;
}

async function xhrGetIpAddress(ip, i) {
    ajaxProxy.init();
    ajaxProxy.proxy.url = 'http://' + ip[0] + ':' + ip[1];
    ajaxProxy.proxy.credentials.username = ip[2];
    ajaxProxy.proxy.credentials.password = ip[3];
    var loader = document.getElementById("Js_load");
    var bar = loader.querySelector(".j_loadtext");

    $.ajax({
        type: "GET",
        url: 'http://api.ipify.org',
        headers: ajaxProxy.proxyHeaders(),
        dataType: "text"
    }).done(async function (data) {

        percentCounter += 100 / doneCounter;
        ipList.push({'ip': data, 'proxy': ip[0] + ':' + ip[1] + ':' + ip[2] + ':' + ip[3]})
    });


}

 function createEffectHtml() {
    let newDiv = document.createElement("div");
    newDiv.innerHTML = "<div class=\"loading justify-content-center \" id=\"Js_load\">\n" +
        "    <div class=\"load position-absolute top-50 start-50 translate-middle\">\n" +
        "        <div class=\"load-cell1\"></div>\n" +
        "        <div class=\"load-cell2\"></div>\n" +
        "        <span id=\"j_loadtext\" class=\"load-text j_loadtext\">84.3%</span>\n" +
        "    </div>\n" +
        "    <div class=\"mt-3 w-50 ml-0 mr-0 mx-auto text-center\" style=\"width: 250px\" id=\"timeout\">Auto close 180 seconds.</div>\n" +
        "    <div class=\"mt-1\">\n" +
        "        <button class=\"btn btn-dark\" onclick=\"loadOk()\">Close</button>\n" +
        "        <button class=\"btn btn-danger\" style=\"width: 75px\" onclick=\"counterUpDown(-5)\">-5</button>\n" +
        "        <button class=\"btn btn-success\" style=\"width: 75px\" onclick=\"counterUpDown(5)\">+5</button>\n" +
        "    </div>\n" +
        "    <div class=\"mt-4 w-50 ml-0 mr-0 mx-auto text-center\" style=\"width: 250px\" id=\"findipCount\"><br> founded ips 5.</div>\n" +
        "</div>";
    document.body.appendChild(newDiv);
}

 function resetDefaultVariable() {

    id=intervalTrigger();
    doneCounter = 0;
    ipList = [];
    uniqueIps = [];
    timeout = 180;
}

async function main() {

    resetDefaultVariable();
    await createEffectHtml();
    var objectIpsPortUsernamePass = await startEdit();

    doneCounter = objectIpsPortUsernamePass.length;

    percentCounter++;

    for (var i = 0; i < doneCounter; i++) {
        xhrGetIpAddress(objectIpsPortUsernamePass[i], i + 1)
        await sleep(250);
    }


}

function createDonePercentIndexHtml() {
    let newDiv = document.createElement("div");
    newDiv.innerHTML = "<div id='uniqueDiv' class='w-100'>Unique Ips " + uniqueIps.length + " </div>";
    document.body.appendChild(newDiv);
}

function intervalTrigger() {
    return window.setInterval(function () {
        console.log('start')
        var num = percentCounter
        if (num >= 1) {
            var bar = document.getElementById("j_loadtext");
            if (num > 90) {
                num = 90;
            } else {
                bar.innerText = num.toString().substr(0, 4) + "%";
            }

            if (timeout < 0) {
                window.clearInterval(id);
                loadOk()
            }
            document.getElementById('timeout').innerText = 'Auto close ' + timeout + ' seconds.';
            document.getElementById('findipCount').innerText = '\n founded ips ' + ipList.length + '.'
            timeout--;
        }
    }, 1000)
}

function counterUpDown(time) {
    timeout += time
    document.getElementById('timeout').innerText = 'Auto close ' + timeout + ' seconds.';
}

