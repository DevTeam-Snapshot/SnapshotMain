# SnapshotMain
Team Snapshot 프로젝트의 배포용 레포지토리  

발표자료 : https://drive.google.com/file/d/1CSH2bcx5mMeGgoAJ4iF2AlhOhvaEzgtR/view?usp=drive_link   

시연영상 : https://drive.google.com/file/d/1LBIhv9L-WHfjjQY6E-9nPZ-0MpjjUKKA/view?usp=drive_link      

협업일지 링크     

  이찬울 :  
  정서호 :  
  박종선 :   

## 이 레포지토리는 여러 개의 서버를 구동하여 배포하는 것이 목적입니다.
각 폴더 내부에는 프레임워크가 들어있으며, 각 폴더당 .env 파일을 생성하셔야 합니다.

FastAPI -> postgre.env 및 .env  
React -> .env  
vLLM -> .env  

각 프로젝트 내부에는 .env.example 파일이 있으니, 이를 참고하셔서 .env의 내용을 작성해주세요.    
예를 들면, OpenAPI_Key를 발급하신 후 vLLM 폴더 내부 .env에 작성해주셔야 합니다.  

# SnapshotMain v0-zeroground  
연동 테스트 배포 완료 (2026-09-10)  

구동 서버 목록  
FrontEnd : React, Bootstrap(CDI Link를 통해 참조)  
BackEnd : FastAPI, PostgreSQL
ServingModel : vLLM (gRPC)

<img width="1280" height="717" alt="image" src="https://github.com/user-attachments/assets/42216e7a-8442-464e-b24c-40892d110396" />  

테스트 상세 과정    

  React 서버에서 유저가 언어모델에 대한 질문과 DB에서 값을 참조할 Index를 폼으로 작성 후 Submit, RestAPI Post 요청 ->
  FastAPI 서버에서 언어모델에 대한 질문에 대한 답변 vLLM에 gRPC로 요청 ->
  vLLM 서버에서 언어 모델이 질문에 대한 답변을 생성하여 FastAPI에 gRPC로 전달 ->  
  FastAPI 서버에서 PostgreSQL DB 서버에 Index에 대한 값 조회 요청 ->
  PostgreSQL 서버에서 Index에 대한 Value를 찾아서 FastAPI에 전달 ->
  FastAPI에서 모델의 질문에 대한 답변과 Index에 대한 값을 React 서버에 응답  

  결과 : 성공 후 배포까지 완료  
  
# SnapshotMain v1-core
광고 이미지 생성 기능 추가 (2026-09-11)
  - 이미지 폴더를 FastAPI 내부에서 관리합니다.

클라우드 내부에서 테스트를 수행할 때는 port 80을 포트포워딩해주어야합니다.  
프로젝트 배포를 할 때는 클라우드 방화벽 설정으로 외부 아이피&포트80을 연결 가능하게 설정해주시기 바랍니다.  

<img width="883" height="383" alt="image" src="https://github.com/user-attachments/assets/dd6c8644-685d-45a8-8798-a3d92c33530e" />  

테스트 상세 과정 :  

  유저가 폼을 작성하여 텍스트 데이터와 이미지를 Submit, FastAPI에 요청(Multipart/Form Data) ->  
  FastAPI 서버에서 vLLM에 gRPC로 광고 이미지 생성 요청 ->
  vllm 서버에서 OpenAPI ImageGen 토큰을 사용하여 광고 이미지를 생성한 후 API 서버로부터 생성된 광고 이미지를 FastAPI로 gRPC를 통해 응답 ->  
  FastAPI 서버에서 이미지를 이미지 폴더에 저장한 후, image url을 React로 응답 ->  
  React는 FastAPI 서버에서 응답한 URL을 참조하여 이미지 렌더링

  결과 : 테스트 성공 후 배포 완료  

# SnapshotMain v2-functions
본격적인 디자인 템플릿 구성, MainPage, MakingAds, SelectAds 페이지로 구성됨  
기능 중심의 개발 : 페이지 Navigate, 유저는 챗봇과의 대화를 통해 보이지않는 폼을 작성하고 Submit, 유저는 생성된 광고이미지를 개인 성향에 맞게 선택하여 다운로드가 가능합니다.  

docker-compose 파일에 전체 구동과정이 작성되어 있으니, docker compose 명령어만 입력해주세요  
docker compose up --build -d  
서버를 배포하지 않는 경우에는 80번 포트를 포트포워딩하여 사용하시고,
서버를 배포하는 경우에는 서버의 80번 포트를 개방해주시기 바랍니다.
