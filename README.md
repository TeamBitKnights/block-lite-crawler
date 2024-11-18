# block-lite-crawler

## 설명

이 프로젝트는 EVM 체인에서 작동하는 오픈소스 블록 탐색기입니다. 이 저장소를 통해 로컬에서 탐색기를 실행할 수 있습니다. 이 저장소는 데이터를 크롤링하는 코드와 데이터베이스 설정을 제공합니다. 이 로직은 체인의 RPC URL에 2.5초마다 접근하여 데이터를 수신하고 이를 데이터베이스에 저장합니다.

## 시작하기

### 데이터베이스 설정

**이 작업은 MySQL 에서 수행됩니다. 먼저 설정을 진행하세요.**  
크롤링 서버를 실행하기 전에 아래의 SQL 쿼리를 실행하여 데이터베이스를 생성하세요.

```sql
CREATE DATABASE explorer_db;

USE explorer_db;

CREATE TABLE block_data(
  blocknumber INT NOT NULL,
  time_stamp VARCHAR(256) NOT NULL,
  blockhash VARCHAR(256) NOT NULL,
  transaction_length VARCHAR(256) NOT NULL,
  primary key (blocknumber),
  constraint uq_multicolumn unique (blocknumber, time_stamp)
);

CREATE TABLE transaction_data(
  blockNumber INT NOT NULL,
  blockNumberHex VARCHAR(256) NOT NULL,
  txHash VARCHAR(256) NOT NULL,
  time_stamp VARCHAR(256) NOT NULL,
  fromAddress VARCHAR(256) NOT NULL,
  toAddress VARCHAR(256) NOT NULL,
  value VARCHAR(256) NOT NULL,
  constraint uq_txHash unique (txHash)
);

CREATE TABLE contract_data(
  blocknumber INT NOT NULL,
  contractAddress VARCHAR(256) NOT NULL,
  primary key (blocknumber),
  constraint uq_multicolumn unique (blocknumber, contractAddress)
);
```

### 설치 방법

- 이 저장소를 Git 클론하세요.

```bash
https://github.com/TeamOliveCode/block-lite-crawler.git
```

- MySQL 데이터베이스 설정을 업데이트하기 위해 `.env` 파일을 생성하세요.

```env
DB_HOST="host"
DB_USER="user"
DB_PASSWORD="password"
DB_DATABASE="explorer_db"
```

- `etherApi.js` 파일에서 'baseURL'을 사용 중인 블록체인 RPC URL로 변경하세요.

```javascript
const axios = require('axios');

const etherApi = axios.create({
  // 블록체인 RPC URL을 변경하세요
  baseURL: 'https://eth.public-rpc.com',
  headers: { 'content-type': 'application/json' },
});

module.exports = { etherApi };
```

- 아래 명령어를 사용해 로컬에서 실행하세요.

```bash
npm install --save
node server.js
```
