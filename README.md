# moija-comment

## 1) dockerfile



```dockerfile

# Step 1
## base image for Step 1: Node 10
FROM node:10 AS builder
WORKDIR /app
## 프로젝트의 모든 파일을 WORKDIR(/app)로 복사한다
COPY . .
## Nest.js project를 build 한다
RUN npm install
RUN npm run build


# Step 2
## base image for Step 2: Node 10-alpine(light weight)
FROM node:10-alpine
WORKDIR /app
## Step 1의 builder에서 build된 프로젝트를 가져온다
COPY --from=builder /app ./
## application 실행
CMD ["npm", "run", "start:prod"]
```



## 2) .dockerignore

``` bash
node_modules
dist
```



## 3) Docker Image Build

해당 프로젝트 폴더의 콘솔에서 아래 명령어로 build

```bash
$ docker build -t s3-image-upload .
```

`-t` : 해당 이미지에 tag 설정 (name은 아님)

```bash
$ docker images
```

이미지를 백그라운드에서 run

```bash
$ docker run -d s3-image-upload
```





## 2) Docker Container 포트 포워딩

```bash
$ docker run -p <container port number>:<host port number>/<protocol> [ImageName]
```

- `<container port number>` : 컨테이너 내에서 사용되는 포트 번호
- `<host port number>` : 호스트 시스템에서 사용되는 포트 번호
- `<protocol>` : 프로토콜 유형 - udp, tcp, stcp 등

```bash
$ docker run -d -p 3000:3000 ydh2244:moija-comment
```

-> 백그라운드에서 포트 번호 3000으로 s3-image-upload server run





## ec2에 도커 설치

```bash
curl -fsSL https://get.docker.com/ | sudo sh
sudo usermod -aG docker $USER

sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# check (re-login)
docker version
docker-compose version

# reboot
sudo reboot
```





### 1) Docker 컨테이너(Container) 커밋(Commit)하기

- 현재까지 작업해 놓은 ubuntu 컨테이너를 그대로 저장하고 싶다.
- 실행중인 컨테이너를 커밋해보자.
- `docker commit <이미지 이름>` 명령 이용.

```bash
$ docker commit ubuntu-cpp-driver ubuntu-cpp-driver
sha256:85b8eb5a23e6c850c4f4d298119275ec5a85bc43c78414372aee2859e9ad9e54
```

- container 이름이 ubuntu-cpp-driver 였고, 이를 이미지로 저장할 때 이미지 이름도 동일하게 했다.
- `docker images`로 확인해보자.

```bash
$ docker images
REPOSITORY                  TAG                 IMAGE ID            CREATED              SIZE
ubuntu-cpp-driver           latest              85b8eb5a23e6        About a minute ago   582MB
```

### 2) Docker 이미지(Image) Push하기

- Docker cloud 에 로그인 하기

```bash
$ docker login
```

- docker user id 변수 지정해놓기

```bash
$ export DOCKER_ID_USER="nicewoong"
```

- Docker Image 에 태그 달기

```bash
$ docker tag ydh2244/moija-comment:latest ydh2244/moija-comment:comment

## 태그명을 latest -> comment로 변경
```

- Tag 가 적용되어 있는 Image 를 Docker Cloud 에 Push

```bash
$ docker push $DOCKER_ID_USER/ubuntu-cpp-driver
The push refers to a repository [docker.io/nicewoong/ubuntu-cpp-driver]
441a4ecb7164: Pushing [==================================================>]  472.2MB
7f7a065d245a: Mounted from nicewoong/ubuntu-bluecoat 
f96e6b25195f: Mounted from nicewoong/ubuntu-bluecoat 
c56153825175: Mounted from nicewoong/ubuntu-bluecoat 
ae620432889d: Mounted from nicewoong/ubuntu-bluecoat 
a2022691bf95: Mounted from nicewoong/ubuntu-bluecoat 
```





## 4) 명령어

#### (1) 도커 컨테이너

#### 1) 정지된 컨테이너

```bash
$ docker ps -a
```

#### 2) 동작중인 컨테이너

```bash
$ docker ps
```

#### 3) 컨테이너 삭제

```bash
$ docker rm <컨테이너 아이디>
# 하나

$ docker rm <컨테이너 아이디>, <컨테이너 아이디>, <컨테이너 아이디>
# 복수

$ docker rm `docker ps -a -q`
# 모두
```





#### (2) 도커 이미지 태깅

#### 1) 현재 이미지 확인

```bash
$ docker images
```

#### 2) 이미지 삭제

```bash
$ docker rmi <이미지 아이디>
```

#### 3) 이미지 태깅

```bash
$ docker tag ydh2244/moija-comment:latest ydh2244/moija-comment:comment
```



● 이미지 조회
docker images                  → 도커 이미지 목록 보기 (dangling)
docker images -a               → 도커 이미지 목록 보기 (전체)
● 이미지 실행
docker run -it [image-id] /bin/bash                → 컨테이너를 interactive 모드로 실행 (기본계정:root)
docker run -it -u zany -w ~ [image-id] /bin/bash   → 컨테이너를 interactive 모드로 실행 (기본계정:zany)
  ○ [image-id] 부분은 [repository:tag] 와 같이 입력해도 동일함.
  ○ '-it' 옵션대신 '-itd' 옵션을 주면 interactive + tty + detach 로 실행됨 (백그라운드실행)
  ○ '-it' 옵션으로 실행했을 경우,
    - 컨테이너 종료 없이 쉘을 빠져나올때 Ctrl + P,Q (exit 명령으로 빠져나오면 컨테이너가 종료됨)
    - 다시 불러들일 때는 docker attach [container-id] 명령을 사용한다.
  ○ '-itd' 옵션으로 실행했을 경우,
    - 이미 해당 이미지는 백그라운드에서 수행중.
    - docker exec -it [container-id] /bin/bash 명령으로 접근.
    - 빠져나올때는 그냥 exit 명령으로 나오면 됨.
● 이미지 삭제
docker images -f dangling=true                     → untagged/dangling 이미지만 보기
docker rmi $(docker images -q -f dangling=true)    → 모든 untagged/dangling 이미지 삭제
docker rmi $(docker images -q)                     → 모든 이미지 삭제 (주의, 다 날라감)
● 컨테이너 조회
docker ps                      → 컨테이너 목록 보기
docker ps -a                   → 모든 컨테이너 목록 보기
● 컨테이너 삭제
docker kill $(docker ps -q -f status=running)   → 현재 실행중인 모든 컨테이너 강제 종료
docker stop $(docker ps -q -f status=running)   → 현재 실행중인 모든 컨테이너 종료
docker rm $(docker ps -q -f status=exited)      → 종료된 모든 컨테이너 삭제

docker kill vs stop
stop attempts to trigger a graceful shutdown by sending the standard POSIX signal SIGTERM, 
whereas kill just kills the process by default (but also allows to send any other signal)
● 정보 확인
docker inspect [IMAGE-ID/NAME] → 이미지 정보 출력 (Return low-level information on Docker objects)