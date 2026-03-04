# YES24 모형 - Android WebView

React 웹앱을 WebView로 감싸 모바일 앱처럼 실행합니다.

## 요구사항
- Android Studio Hedgehog (2023.1.1) 이상
- JDK 17

## 실행 방법

1. 프로젝트 루트(`BookVillage/`)에서 통합 환경 실행:
   ```
   docker compose -f docker-compose.integration.yml up -d --build
   ```
   - 기본 WebView URL은 `http://10.0.2.2:8081` 입니다.

2. Android Studio에서 `ohyes24/android` 프로젝트를 열고 Run

3. URL 변경이 필요하면 `android/gradle.properties`의 `webAppUrl` 값을 수정
   - 에뮬레이터 + Vite 개발 서버: `http://10.0.2.2:3000`
   - 실기기 + 도커 프론트: `http://<PC_IP>:8081`
   - 실기기 + Vite 개발 서버: `http://<PC_IP>:3000`

4. 값 변경 후 Android Studio에서 Gradle Sync를 한 번 실행하고 앱을 다시 Run

## 배포

프로덕션 React 앱 URL을 `webAppUrl`로 설정한 뒤 APK를 빌드하세요.
