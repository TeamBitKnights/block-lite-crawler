const { db } = require('./db');
const { etherApi } = require('./etherApi');
const { rpcGetLatestData } = require('./rpcGetLatestData');

const rpcRecheckBlockNum = async () => {
  try {
    await eth_blockNumber();
  } catch (error) {
    console.error('Error in rpcCheckBlockNum:', error);
  }
};

// 이더리움 블록 번호를 가져오는 함수
const eth_blockNumber = async () => {
  try {
    const response = await etherApi.post('', {
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 9,
    });

    let latestBlock = response.data.result;
    await db_checkBlockNum(latestBlock); // 비동기 함수는 await로 호출
  } catch (error) {
    console.error('Error fetching block number from RPC:', error);
  }
};
// 데이터베이스에서 블록 번호를 확인하는 함수
const db_checkBlockNum = async (latestBlock) => {
  let blockNumber = parseInt(latestBlock, 16);

  // 최근 30개의 블록 데이터를 1분마다 확인
  for (let i = 1; i < 30; i++) {
    let checkNumber = blockNumber - i;
    let number = Number(checkNumber);

    const txHashInsert =
      "SELECT IF(EXISTS(SELECT * from block_data WHERE blocknumber = ?), '1', '0' ) as RESULT";

    db.query(txHashInsert, [number], async (err, result) => {
      if (err) {
        console.error('Error querying the database for block', number, err);
        return;
      }

      try {
        let string = JSON.stringify(result);
        let parse = JSON.parse(string);
        let checkBlockNum = parse[0].RESULT;

        if (checkBlockNum === '0') {
          console.log('missed block data', number);
          try {
            await rpcGetLatestData(number); // 비동기 처리 추가
          } catch (rpcError) {
            console.error(
              'Error fetching latest block data for block',
              number,
              rpcError
            );
          }
        } else {
          console.log('block data already existed', number);
        }
      } catch (parseError) {
        console.error('Error parsing result for block', number, parseError);
      }
    });
  }
};

module.exports = { rpcRecheckBlockNum };
