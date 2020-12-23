let uilog = {};

uilog.warn = function(warning) {
    let ui = document.getElementById('uilog');
    let now = new Date();
    ui.innerHTML+=`<div class="uilogwarning"><div class="uilogtimestamp">${now}:</div> ${warning}</div>`;
    uilog.popOverflow();
}

uilog.inform = function(info) {
    let ui = document.getElementById('uilog');
    let now = new Date();
    ui.innerHTML+=`<div class="uiloginfo"><div class="uilogtimestamp">${now}:</div> ${info}</div>`;
    uilog.popOverflow();
}

uilog.upgrade = function(upgrade){
    let ui = document.getElementById('uilog');
    let now = new Date();
    ui.innerHTML+=`<div class="uilogupgrade"><div class="uilogtimestamp">${now}:</div> ${upgrade}</div>`;
    uilog.popOverflow();
}

uilog.popOverflow = function(ui = document.getElementById('uilog')) {
    if (ui.children.length > 5){
        ui.removeChild(ui.children[0]);
    }
}