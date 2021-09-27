mediaTemplate = `<div class="media" id="{{ID}}">
<img src="{{IMAGE}}" class="align-self-center mr-3" alt="썸네일 이미지">
<div class="media-body">
  <div class="media-contents-container">
    <h5 class="mt-0"><a href="{{URL}}" target="_blank">{{TITLE}}</a></h5>
    <p class="post-description-text">{{DESCRIPTION}}</p>
    <p class="mb-0">{{COMMENT}}</p>
  </div>
  <div class="btn-container">
    <button class="btn btn-primary btn-modify" onclick="modifyMemo(this)">수정하기</button>
    <button class="btn btn-primary btn-delete" onclick="deleteMemo(this)">삭제하기</button>
  </div>
</div>
<div class="modify-form-container">
  <div class="form-group">
    <label for="post-url">포스트 URL</label>
    <input type="text" class="form-control" id="post-url">  
  </div>
  <div class="form-group">
    <label for="post-title">제목</label>
    <input type="text" class="form-control" id="post-title">  
  </div>
  <div class="form-group">
    <label for="post-image-url">이미지 URL</label>
    <input type="text" class="form-control" id="post-image-url">  
  </div>
  <div class="form-group">
    <label for="post-description">설명</label>
    <textarea type="text" class="form-control" id="post-description"></textarea>  
  </div>
  <div class="form-group">
    <label for="post-comment">코멘트</label>
    <textarea type="text" class="form-control" id="post-comment"></textarea>
  </div>
  <button type="submit" class="btn btn-primary" onclick="modifyComplete('{{ID}}')">완료</button>
  <button type="submit" class="btn btn-primary" onclick="modifyCancle('{{ID}}')">취소</button>
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
                      .replaceAll('{{ID}}', id)
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
                    .replaceAll('{{ID}}', id)
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

function modifyMemo(e) {
  let thisMedia = $(e).closest('.media')
  let imgTag = thisMedia.children('img')
  let mediaBody = thisMedia.children('.media-body')  
  let modifyForm = thisMedia.children('.modify-form-container')
  let imgUrl, postTitle, postDescription, postComment, postUrl
  imgUrl = imgTag.attr('src')
  postTitle = mediaBody.find('.media-contents-container .mt-0>a').text()
  postUrl = mediaBody.find('.media-contents-container .mt-0>a').attr('href')
  postDescription = mediaBody.find('.media-contents-container>.post-description-text').text()
  postComment = mediaBody.find('.media-contents-container>.mb-0').text()
  
  imgTag.hide()
  mediaBody.hide()
  modifyForm.show()

  modifyForm.find('#post-url').val(postUrl)
  modifyForm.find('#post-title').val(postTitle)
  modifyForm.find('#post-image-url').val(imgUrl)
  modifyForm.find('#post-description').val(postDescription)
  modifyForm.find('#post-comment').val(postComment)
}

function modifyComplete(id) {
  let modifyForm = $(`#${id}`).find('.modify-form-container')
  let imgTag = $(`#${id}`).children('img')
  let mediaBody = $(`#${id}`).children('.media-body')  
  
  let url_give, title_give, image_url_give, description_give, comment_give
  
  url_give = modifyForm.find('div.form-group>input#post-url').val()
  title_give = modifyForm.find('div.form-group>input#post-title').val()
  image_url_give = modifyForm.find('div.form-group>input#post-image-url').val()
  description_give = modifyForm.find('div.form-group>textarea#post-description').val()
  comment_give = modifyForm.find('div.form-group>textarea#post-comment').val()
  
  $.ajax({
    type: "POST",
    url: "/api/modifyPost",
    data: {url_give, 
          title_give, 
          image_url_give,
          description_give,
          comment_give,
          id_give:id},
    success: function({result}) {
      if (result === 'success'){
        // 내용 변경 
        imgUrl = imgTag.attr('src', image_url_give)
        postTitle = mediaBody.find('.media-contents-container .mt-0>a').text(title_give)
        postUrl = mediaBody.find('.media-contents-container .mt-0>a').attr('href', url_give)
        postDescription = mediaBody.find('.media-contents-container>.post-description-text').text(description_give)
        postComment = mediaBody.find('.media-contents-container>.mb-0').text(comment_give)
        
        imgTag.show()
        mediaBody.show()
        modifyForm.hide()

        alert('수정 완료')
      }
    }
  })
}

function modifyCancle(id) {
  let imgTag = $(`#${id}`).children('img')
  let mediaBody = $(`#${id}`).children('.media-body')  
  let modifyForm = $(`#${id}`).children('.modify-form-container')

  imgTag.show()
  mediaBody.show()
  modifyForm.hide()
}

$(document).ready(function(){
  getMemo()
})

