function togglePostingBox() {
  let state = $('.form-container').css('display')
  if(state === 'block') $('.form-container').css('display', 'none')
  if(state === 'none') $('.form-container').css('display', 'block')
}