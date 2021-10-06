export const randomInt = (size: number) => {
  return Math.floor((Math.random() * size) + 1)
}

export const format = (sec_num: number) => {
  var hours = Math.floor(sec_num / 3600)
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60)
  var seconds = sec_num - (hours * 3600) - (minutes * 60)

  var h = '', m = '', s = ''
  if (hours < 10) { h = "0" + hours; }
  if (minutes < 10) { m = "0" + minutes; }
  if (seconds < 10) { s = "0" + seconds; }
  return h + ':' + m + ':' + s;
}