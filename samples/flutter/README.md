# Dart domain sample

운영 Flutter 앱은 Dart UI·상태 관리와 Android Kotlin foreground service, iOS Swift ActivityKit bridge를 결합합니다. 이 공개 패키지는 플랫폼 권한과 운영 API 없이 공유 도메인 규칙만 검증합니다.

- 지연을 반영한 `boarding`/`running` 단계
- 자정 통과 시각표 정규화
- 오래된 응답의 commit을 거절하는 revision gate

```bash
dart pub get
dart analyze
dart test
```

전체 Flutter 화면, Android service와 iOS bridge는 제품 복제를 막기 위해 공개 범위에서 제외했습니다.
