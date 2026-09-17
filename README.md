# SnapshotMain
Team Snapshot 프로젝트의 배포용 레포지토리

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
