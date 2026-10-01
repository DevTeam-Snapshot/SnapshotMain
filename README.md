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

# SnapshotMain v0-zeroground  
연동테스트 배포 완료 (2026-09-10)

# SnapshotMain v1-core
광고 이미지 생성 기능 추가 (2026-09-11)
  - 이미지 폴더를 FastAPI 내부에서 관리합니다.

클라우드 내부에서 테스트를 수행할 때는 port 80을 포트포워딩해주어야합니다.  
프로젝트 배포를 할 때는 클라우드 방화벽 설정으로 외부 아이피&포트80을 연결 가능하게 설정해주시기 바랍니다.  

# SnapshotMain v2-functions
본격적인 디자인 템플릿 구성, MainPage, MakingAds, SelectAds 페이지로 구성됨  
기능 중심의 개발 : 페이지 Navigate, 유저는 챗봇과의 대화를 통해 보이지않는 폼을 작성하고 Submit, 유저는 생성된 광고이미지를 개인 성향에 맞게 선택하여 다운로드가 가능합니다.  

docker-compose 파일에 전체 구동과정이 작성되어 있으니, docker compose 명령어만 입력해주세요  
docker compose up --build -d  
서버를 배포하지 않는 경우에는 80번 포트를 포트포워딩하여 사용하시고,
서버를 배포하는 경우에는 서버의 80번 포트를 개방해주시기 바랍니다.
