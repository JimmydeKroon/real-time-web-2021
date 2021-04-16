const socket = io()

const rows = document.querySelectorAll('.pads > .padsgroup')
const playButton = document.querySelector('.playbutton')

let step = 1;

setInterval(function loop() {
  if (step > 7) {step = 0}

  for (let i = 0; i < rows.length; i++) {

    const row = rows[i];
    const input = row.querySelector(`input:nth-child(${step + 1})`);
    console.log(input);

    if (input.checked) {
    // console.log(input);
    }
  }
  step++;
}, 2000);
