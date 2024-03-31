const UILOG = {
    elementId: 'uilog',
    maxChildren: 4,
    warn(warning) {
        let ui = document.getElementById(this.elementId);
        let now = new Date();
        ui.innerHTML+=`<div class="uilogwarning"><div class="uilogtimestamp">${now}:</div> ${warning}</div>`;
        this.popOverflow();
    },
    inform(info) {
        let ui = document.getElementById(this.elementId);
        let now = new Date();
        ui.innerHTML+=`<div class="uiloginfo"><div class="uilogtimestamp">${now}:</div> ${info}</div>`;
        this.popOverflow();
    },
    upgrade(upgrade){
        let ui = document.getElementById(this.elementId);
        let now = new Date();
        ui.innerHTML+=`<div class="uilogupgrade"><div class="uilogtimestamp">${now}:</div> ${upgrade}</div>`;
        this.popOverflow();
    },
    popOverflow() {
        let ui = document.getElementById(this.elementId);
        if (ui.children.length > this.maxChildren){
            ui.removeChild(ui.children[0]);
        }
    }
};