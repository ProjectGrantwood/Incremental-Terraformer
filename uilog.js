let uilog = {
    elementId: 'uilog',
    maxChildren: 4,
    warn(warning) {
        let ui = document.getElementById(uilog.elementId);
        let now = new Date();
        ui.innerHTML+=`<div class="uilogwarning"><div class="uilogtimestamp">${now}:</div> ${warning}</div>`;
        uilog.popOverflow();
    },
    inform(info) {
        let ui = document.getElementById(uilog.elementId);
        let now = new Date();
        ui.innerHTML+=`<div class="uiloginfo"><div class="uilogtimestamp">${now}:</div> ${info}</div>`;
        uilog.popOverflow();
    },
    upgrade(upgrade){
        let ui = document.getElementById(uilog.elementId);
        let now = new Date();
        ui.innerHTML+=`<div class="uilogupgrade"><div class="uilogtimestamp">${now}:</div> ${upgrade}</div>`;
        uilog.popOverflow();
    },
    popOverflow() {
        let ui = document.getElementById(uilog.elementId);
        if (ui.children.length > uilog.maxChildren){
            ui.removeChild(ui.children[0]);
        }
    }
};