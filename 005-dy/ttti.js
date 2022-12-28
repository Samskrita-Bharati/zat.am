window.onload = () => {
  let p1 = window.prompt(
    'प्रथमस्य (१) नाम किम्? - 1st - prathamasya naama kim ? [x]',
    'प्रथमः')
  p1 ??= 'प्रथमः'; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment
  let p2 = window.prompt(
    'द्वितीयस्य (२) नाम किम् - 2nd - dvitiiyasya naama kim ? [☺]',
    (p1 === 'द्वितीयः') ? 'प्रथमः' : 'द्वितीयः')
  p2 ??= (p1 === 'द्वितीयः') ? 'प्रथमः' : 'द्वितीयः';
  while (p2 === p1) {
    p2 = window.prompt(
      `द्वितीयस्य (२) नाम किम्: Please enter a different name than ${p1}.`
      , 'द्वितीयः')
    p2 ??= (p1 === 'द्वितीयः') ? 'प्रथमः' : 'द्वितीयः';
  }

  const game = new Game(p1, p2)
  const turn = document.getElementById('turn')
  const player = document.getElementById('player')
  player.innerText = game.player

  document.querySelectorAll('td').forEach((el) => {
    el.onclick = (evt) => {
      el.onclick = undefined
      evt.target.innerText = game.sym
      evt.target.onclick = undefined

      const [row, col] = evt.target.classList
      game.turn(row, col)

      if (game.hasWinner()) {
        document.getElementById('jayaH').innerText = "जयतु संस्कृतम् ।  "
        turn.style.color = 'orange'
        turn.innerText = ` कस्य जयः ? - kasya jayaH - ${game.player} !!! `
        document.querySelectorAll('td').forEach(el => {
          el.onclick = undefined
        })
        document.querySelectorAll('td').forEach(el => {
          if (el.innerText == game.sym) el.style.color = "orange"
        })
      } else {
        game.nextPlayer()
        player.innerText = game.player
      }
    }
  })
}