# Synthetic API server

실제 철도 데이터 제공자 대신 결정적인 fixture를 반환하는 Node.js 20+ 샘플입니다. 외부 패키지와 운영 endpoint가 없으며 다음 설계를 검토할 수 있습니다.

- 입력을 검증하는 HTTP API 경계
- Unix timestamp 초 단위 응답 계약
- TTL 값 캐시와 진행 중 요청 병합
- 지연을 반영한 `boarding`/`running` 상태
- 확정 위치와 좌표 기반 추정값의 분리

```bash
npm test
npm start
```

서버 실행 후 `http://localhost:3000/stations`를 열 수 있습니다. 전체 계약은 [`../../contracts/openapi.yaml`](../../contracts/openapi.yaml)에 있습니다.
