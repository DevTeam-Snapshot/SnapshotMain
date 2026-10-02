# SnapshotMain
Team Snapshot 프로젝트의 배포용 레포지토리  

보고서 : https://drive.google.com/file/d/1jGmdMH_gQnwLES2jzVgzYkgGcPTSIA8-/view?usp=drive_link  

발표자료 : https://drive.google.com/file/d/1CSH2bcx5mMeGgoAJ4iF2AlhOhvaEzgtR/view?usp=drive_link   

시연영상 : https://drive.google.com/file/d/1LBIhv9L-WHfjjQY6E-9nPZ-0MpjjUKKA/view?usp=drive_link       

협업일지 링크     

  이찬울 :  https://app.notion.com/p/3ed7149252b28074abeddcd9ada11a00  
  정서호 :  https://docs.google.com/spreadsheets/d/1Va2l9G57q0sOdIxeBeakZoa7Ti242ujYEL34mB6W0GM/edit?pli=1&gid=580768231#gid=580768231  
  박종선 :  https://app.notion.com/p/AI-3d4761f8585780c49f29fefc4a7a83b7?source=copy_link

## 이 레포지토리는 하나의 기기에 여러 개의 서버를 구동하여 배포하는 것이 목적입니다.  
레포지토리 내부의 폴더는 각 서버 파트 담당자들의 Github를 참조하여 구성되었습니다.  

FrontEnd Part (React, Bootstrap) : 이찬울,  https://github.com/DevTeam-Snapshot/React-Frontend  
BackEnd Part (FastAPI, PostgreSQL) : 정서호,   https://github.com/DevTeam-Snapshot/FastAPI-Backend  
ServingModel Part (vLLM using gRPC) : 박종선,   https://github.com/DevTeam-Snapshot/vLLM-Model

각 폴더 내부에는 프레임워크가 들어있으며, 각 폴더당 .env 파일을 생성하셔야 합니다.  
.env.example 파일이 있으니, 같은 위치에 .env를 생성하셔서 example 파일을 복붙하신 후 빈 필드를 채워주시기 바랍니다.  

FastAPI -> postgre.env 및 .env  
React -> .env  
vLLM -> .env  

각 프로젝트 내부에는 .env.example 파일이 있으니, 이를 참고하셔서 .env의 내용을 작성해주세요.    
예를 들면, OpenAPI_Key를 발급하신 후 vLLM 폴더 내부 .env에 작성해주셔야 합니다.    

※ 주의사항 ※  
vLLM의 Docker Image는 10~20GB나 되는 대용량이며, vLLM으로 모델을 서빙하기 위해서는 GPU 자원이 반드시 필요합니다.  
이 서비스를 위해 GCP VM 환경을 사용하였으며, 사용한 하드웨어 자원은 다음과 같습니다.    
- Cloud Environment : GCP VM,
- Image : ubuntu-accelerator-2204-amd64-with-ndivia-550
- CPU : g2-standard (vCpu : 4, Memory : 16GB) x 1
- GPU : L4 x 1
- HDisk : 100GB

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

  결과 : 성공 후 배포까지 완료, vLLM 서버는 gRPC를 통해 기존에 토큰 별로 처리하는 Batch Process에서 더 나아가 사용자 요청을 배치로 처리하게 됩니다.  
    이를 통해 다중 사용자 요청에 대해 vLLM이 모델을 더 잘 서빙해줄 것이라 기대합니다. PostgreSQL은 pgvector extension을 통해 추후에 Vector Data를 처리할 수 
    있을 것으로 예상되어 선택되었습니다. 파트 담당자들 사이에 디바이스 운영체제가 다르기에 Docker를 채택하였습니다. Docker를 통해 운영체제가 달라도 환경을 맞추고,  
    서비스 초기에 필요한 구동 과정이 자동화되어 통합 레포지토리의 Docker Compose 명령어를 통해 서비스 초기화 및 배포까지 자동화 됩니다. Docker 명령어를 입력하여 각 서버를  
    초기화해주고, remote ssh에서 포트포워딩으로 3000, 9000 번 포트를 켜주시기 바랍니다.  

  프로젝트를 구동하기 위해서는 docker-compose 파일을 실행시켜주셔야 합니다.  
    docker-compose 실행 : docker compose up --build -d
    docker-compose 중지 : docker compose down  
  
# SnapshotMain v1-core
광고 이미지 생성 기능 추가 (2026-09-11)
  - 이미지 폴더를 FastAPI 내부에서 관리합니다.

클라우드 내부에서 테스트를 수행할 때는 port 80을 포트포워딩해주어야합니다.  
프로젝트 배포를 할 때는 클라우드 방화벽 설정으로 외부 아이피&포트80을 연결 가능하게 설정해주시기 바랍니다.    
외부 사용자는 클라우드 IP에 http 연결을 통해 80번 포트로 서비스를 이용할 수 있습니다.  

프로젝트를 구동하기 위해서는 docker-compose 파일을 실행시켜주셔야 합니다.  
docker-compose 실행 : docker compose up --build -d
docker-compose 중지 : docker compose down  

docker container 조회 : docker ps  
docker image 조회 : docker images  

docker compose down을 하게 되면 컨테이너는 모두 실행 종료되니, 이미지를 삭제하시려면 다음 명령어를 이용해주세요  
docker rmi <이미지명>  

<img width="883" height="383" alt="image" src="https://github.com/user-attachments/assets/dd6c8644-685d-45a8-8798-a3d92c33530e" />  

테스트 상세 과정 :  

  유저가 폼을 작성하여 텍스트 데이터와 이미지를 Submit, FastAPI에 요청(Multipart/Form Data) ->    
  FastAPI 서버에서 vLLM에 gRPC로 광고 이미지 생성 요청 ->  
  vllm 서버에서 OpenAPI ImageGen 토큰을 사용하여 광고 이미지를 생성한 후 API 서버로부터 생성된 광고 이미지를 FastAPI로 gRPC를 통해 응답 ->    
  FastAPI 서버에서 이미지를 이미지 폴더에 저장한 후, image url을 React로 응답 ->    
  React는 FastAPI 서버에서 응답한 URL을 참조하여 이미지 렌더링  

  결과 : 테스트 성공 후 배포 완료, 기존에는 포트포워딩을 통해 리액트 서버와 FastAPI 서버를 매핑하였습니다. 이제 nginx가 이역할을 대신합니다. 80번 포트를  
  React Docker Container 3000, FastAPI Docker Container 9000 번을 매핑합니다. 내부에서 연동 테스트를 진행할 때는 80번 포트를 포트포워딩 시켜주시고,  
  외부의 사용자에게 서비스를 배포할 때는 서버의 80번 포트를 개방해주세요. 사용자는 http 80번 포트로 url을 통해 서비스에 접속할 수 있게 됩니다.

# SnapshotMain v2-functions  
V2 서비스 배포완료 (2026-10-01)  

본격적인 디자인 템플릿 구성, MainPage, MakingAds, SelectAds 페이지로 구성됨    

서비스 요약 :  

1. 페이지 Navigate을 통해 정적인 페이지를 추가하지 않고도 하나의 html페이지에서 구성요소만 변경합니다.  
2. 유저는 챗봇과의 대화를 통해 보이지않는 폼을 작성하여 Submit 하게 됩니다.
3. 유저는 생성된 광고이미지를 개인 성향에 맞게 선택하여 개인 로컬에 다운로드가 가능하며, 재생성 버튼을 통해 1회에 한하여 새로운 광고이미지를 선택할 수 있습니다.  
4. 핵심 기능 개발을 위해 로그인 기능, 토큰 기능과 같은 사용자 관리를 위한 기능은 스킵하였습니다.

서비스 구동 방법 :  

docker-compose 파일에 전체 구동과정이 작성되어 있으니, docker compose 명령어만 입력해주세요  
docker compose up --build -d  
서버를 배포하지 않는 경우에는 80번 포트를 포트포워딩하여 사용하시고,  
서버를 배포하는 경우에는 서버의 80번 포트를 개방해주시기 바랍니다.   

원격 연결을 지원하는 앱 : VSCODE remote ssh Extension, RaiDrive, mobaxterm과 같은 프로그램을 사용하시면 포트포워딩을 간편하게 사용하실 수 있습니다.  

V2에서 추가된 기능들 :  

1. 부트스트랩과 CSS를 이용하여 본격적인 서비스를 위한 웹 디자인을 개선하였습니다. 디자인 아이디어는 인스타그램의 주황-퍼플 특유의 그라데이션에서 감명을 받았습니다.
2. 광고 기획 세션 기능 추가 : 사용자는 개인마다 sessionId를 발급받아 해당 세션ID에서 광고를 기획하게 됩니다.
3. 이미지 등록 기능 추가 : 사용자는 챗봇과의 대화흐름 중 이미지를 요청받으면 이미지 입력 버튼이 생성되는데, 해당 버튼을 이용해서 광고 이미지 생성에 기반이 되는 이미지를 등록하게 됩니다.
4. 광고 기획 대화 기능 추가 : 챗봇과 사용자 사이의 질문-대답 쌍은 챗봇의 다음 질문을 생성하게 합니다.
5. Submit 기능 : 사용자가 광고 기획 단계의 모든 질문에 적절히 대답했다면, '다음으로' 버튼이 활성화 됩니다. 이 버튼을 통해 광고 선택 단계로 넘어가게 됩니다.
6. 광고 초안 생성 기능 : 사용자가 '다음으로' 버튼을 통해 광고 기획 단계에서 광고 선택 단계로 넘어가면 플래너와 SelectImg에 필요한 광고 초안 3개 중 하나를 선택하는 화면을 만나게 됩니다.
7. 광고 재생성 기능 : 3개의 초안이 전부 마음에 들지 않으면 1회에 한하여 재생성 버튼을 통해 다시 3개의 이미지를 재생성할 수 있습니다.
8. 다운로드 기능 : 3개의 광고 이미지 중 하나를 선택하고 다운로드 버튼을 누르면 해당 광고 이미지를 사용자 로컬 환경에 다운로드하게 됩니다.

이 밖에도 페이지 Url 이동 버튼, 광고 이미지 3개중 한개 클릭 시 모달로 크게 보기 기능도 구현되었으며, 뷰를 아름답게 구성하기 위해 수면이 움직이는 모션, 중간이 빈 원형이 돌아가는 모션 등이  추가되었습니다.  

V0와 V1에 비하여 많은 기능이 추가되어 적용되었습니다.  

기능이 너무 많아졌기 때문에 시연영상으로 대체하겠습니다. 시연영상은 ReadMe 상단에 Url을 제공하였습니다.  

테스트 결과 :  
  많은 기능을 추가하는 중, vLLM이 업데이트되어 우리팀 프로젝트의 코드가 old하게 되어 배포용 Docker-compose 파일에서 버전 적용이 되지 않는 문제가 발생하였습니다. vLLM은 기존보다 더 큰 Docker Image를 사용하여 이 문제를 해결하였습니다.  현재 vLLM 서버 구동을 위한 Docker Image는 10 ~ 20GB정도의 용량이 필요하며, Docker Image를 불러올 때는 200~300 초의 시간이 걸립니다.  http 를 통해 IP 접속이 보안이 불안하다고 판단되어 https 지원을 하려고 했으나 ssl 인증서 등록을 위한 추가 과금이 필요하여 불가피하게 http 프로토콜(80번 포트 개방)을 유지하기로 하였습니다. 여러 URL 요청을 처리하기 위해, nginx-proxy가 url 별로 도커 컨테이너 주소 및 포트를 url 별로 매핑합니다. 이전 버전에서는 기능이 1개씩있었기 때문에 매핑처리가 단순했지만 url 요청개수가 늘어나면서 작성 패턴별로 나누어 ngix-proxy의 전송 경로, 포트를 지정하였습니다.

감사합니다.
