# Alone링크메모장 구현

## 기능 추가 
- [ ] 내용 수정하기 기능 구현 
- [ ] 삭제하기 기능 구현 
- [ ] 개인별 페이지 구성해보기 - 로그인 페이지? 
## TODO 
* 레이아웃
- [x] 포스팅 박스 열고 닫는 기능 
- [x] 미디어 형식으로 포스팅 출력하기
  - [x] 포함되어야 하는 항목들 : 이미지, 제목, 설명, 코멘트, 수정하기버튼, 삭제하기버튼
* 기능 
- [x] 포스팅을 데이터베이스로부터 불러와서 미디어 형식으로 출력해주기 
  - GET방식으로 요청 
- [x] 포스팅 박스 열고 내용 작성해서 기사저장 버튼을 누르면 작성된 내용을 데이터베이스에 저장하기 
  - POST방식으로 요청 
  - [x] 데이터베이스에 저장되어야 할 내용: 번호, 썸네일 이미지, 제목, 설명, 코멘트(사용자 입력), URL(사용자 입력)
    - [x] 기사 url로부터 썸네일 이미지 얻어내기 
      - [x] 이미지가 없을 때 기본 썸네일 이미지 준비해서 출력하기
    - [x] 기사 url로부터 제목 얻어내기 
    - [x] 기사 url로부터 설명 얻어내기 
  - [x] 기사저장 버튼을 눌렀을 때 성공 메시지 출력하기 
  - [x] 저장된 내용 출력하기 

  
## API 설계 
- [x] 포스팅 불러오기 API
  ### 요청 정보
  - URL: "/posts"
  - 요청 방식: GET
  - 요청 데이터: 없음
  ### 서버 제공 기능 
  - [x] DB에 저장된 정보 가져오기 
  ### 응답 데이터 
  - [x] (JSON)성공 메시지, 포스팅 정보들

- [x] 포스팅 생성 API 
  ### 요청 정보 
  - URL: "/posts"
  - 요청 방식: POST
  - 요청 데이터: URL(url_give), comment(comment_give)
  ### 서버 제공 기능 
  - [x] URL의 meta태그 정보를 바탕으로 제목, 설명, 이미지url 스크래핑 
  - [x] 정보를 구조화하여 데이터베이스에 저장. 
  ### 응답 데이터 
  - (JSON)성공 메시지, 추가된 포스팅 정보
    - [x] 응답 데이터로 바로 포스팅 생성하여 화면에 추가할 수 있도록 하자. 

- [ ] 포스팅 수정 API (설계 필요)
- [ ] 포스팅 삭제 API (설계 필요)