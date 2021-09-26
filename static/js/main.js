mediaTemplate = `<div class="media" id="{{ID}}">
<img src="{{IMAGE}}" class="align-self-center mr-3" alt="썸네일 이미지">
<div class="media-body">
  <h5 class="mt-0"><a href="{{URL}}" target="_blank">{{TITLE}}</a></h5>
  <p>{{DESCRIPTION}}</p>
  <p class="mb-0">{{COMMENT}}</p>
  <div class="btn-container">
    <button class="btn btn-primary btn-modify" onclick="modifyMemo(this)">수정하기</button>
    <button class="btn btn-primary btn-delete" onclick="deleteMemo(this)">삭제하기</button>
  </div>
</div>
</div>`

function togglePostingBox() {
  let state = $('.form-container').css('display')
  if(state === 'block') {
    $('.form-container').css('display', 'none')
    $('#btn-posting-box').text('포스팅박스 열기')
  }
  if(state === 'none') {
    $('.form-container').css('display', 'block')
    $('#btn-posting-box').text('포스팅박스 닫기')
  }
}

function getMemo() {
  $.ajax({
    type: "GET",
    url: "/api/getPosts",
    data: {},
    success: function({result, items}) {
      if(result === 'success'){
        let newMedia
        items.forEach(({url, image, description, comment, title, _id:id})=>{
          newMedia = mediaTemplate
          newMedia = newMedia
                      .replace('{{URL}}', url)
                      .replace('{{TITLE}}', title)
                      .replace('{{DESCRIPTION}}', description)
                      .replace('{{COMMENT}}', comment)
                      .replace('{{IMAGE}}',image)
                      .replace('{{ID}}', id)
          $('.media-container').append(newMedia)  
        })
      }
      else{
        alert("서버에서 문제가 발생하였습니다.")
      }
      media_container_toggle()
      
    }, 
    error: function(response) {
      alert("서버에서 데이터를 가져오는 도중 문제가 발생했습니다.")
    }
  })
}

function addMemo() {
  let url_give = $('#post-url').val()
  let comment_give = $('#post-comment').val()
  if(url_give === ''){
    alert('URL을 입력하세요!')
    return
  }
  if(comment_give === ''){
    alert('코멘트를 입력하세요!')
    return
  }
  
  $.ajax({
    type: "POST",
    url: "/api/createPost",
    data: {url_give,
          comment_give},
    success: function({result, item}) {
      if(result === 'success'){
        let {url, image, description, comment, title, _id:id} = item
        let newMedia = mediaTemplate
        newMedia = newMedia
                    .replace('{{URL}}', url)
                    .replace('{{TITLE}}', title)
                    .replace('{{DESCRIPTION}}', description)
                    .replace('{{COMMENT}}', comment)
                    .replace('{{IMAGE}}',image)
                    .replace('{{ID}}', id)
        $('.media-container').append(newMedia)
        media_container_toggle()
        alert("포스팅 성공!")
      }
      else{
        alert("서버에서 문제가 발생하였습니다.")
      }
    },
    error: function(response) {
      alert("URL을 확인해주세요.")
    }
  })
}

function media_container_toggle() {
  let media_container = $('.media-container')
  if(media_container.children().length===0){
    media_container.hide()
  }
  else{
    media_container.show()
  }
}

function deleteMemo(e) {
  let media_selected = $(e).closest('.media')
  let id_give = media_selected.attr('id')
  $.ajax({
    type: 'DELETE',
    url: '/api/deletePost',
    data: {id_give},
    success: function({result}){
      if(result === 'success'){
        media_selected.remove()
        media_container_toggle()
        alert('삭제 성공!')
      }
    }
  })
}

function modifyMemo() {
  console.log('구현 예정')
}

$(document).ready(function(){
  getMemo()
})

