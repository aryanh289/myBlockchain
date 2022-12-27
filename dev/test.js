const Blockchain = require('./blockchain');
const falcon = new Blockchain();
// console.log(falcon);


const bc1 = 
    {
        "chain": [
        {
        "index": 1,
        "timestamp": 1671950503253,
        "transactions": [],
        "nonce": 100,
        "hash": "0",
        "previousBlockHash": "0"
        },
        {
        "index": 2,
        "timestamp": 1671950578403,
        "transactions": [
        {
        "amount": 100,
        "sender": "KJC9I20FNF2N8392I0",
        "recipient": "KIKJNF0I3DB2IDD2U78",
        "transactionId": "fb599da3939247b0a4573a1d87589aa6"
        },
        {
        "amount": 200,
        "sender": "KJC9I20FNF2N8392I0",
        "recipient": "KIKJNF0I3DB2IDD2U78",
        "transactionId": "3598571636064c6ca393bd7b32eb2d3d"
        },
        {
        "amount": 300,
        "sender": "KJC9I20FNF2N8392I0",
        "recipient": "KIKJNF0I3DB2IDD2U78",
        "transactionId": "f2cf24c4885b4bdfaf457c702c75d4ce"
        },
        {
        "amount": 400,
        "sender": "KJC9I20FNF2N8392I0",
        "recipient": "KIKJNF0I3DB2IDD2U78"
        }
        ],
        "nonce": 12947,
        "hash": "000011978aba5ea2ed92e038fd9fd09861093fafdd797f1f420685885981d1b5",
        "previousBlockHash": "0"
        },
        {
        "index": 3,
        "timestamp": 1671950608390,
        "transactions": [
        {
        "amount": 500,
        "sender": "KJC9I20FNF2N8392I0",
        "recipient": "KIKJNF0I3DB2IDD2U78"
        },
        {
        "amount": 600,
        "sender": "KJC9I20FNF2N8392I0",
        "recipient": "KIKJNF0I3DB2IDD2U78"
        }
        ],
        "nonce": 8467,
        "hash": "0000f9068ddfe372dcdc2b215e347e295a8795e52a5bb2d1ddf50dc61073df69",
        "previousBlockHash": "000011978aba5ea2ed92e038fd9fd09861093fafdd797f1f420685885981d1b5"
        },
        {
        "index": 4,
        "timestamp": 1671950618152,
        "transactions": [],
        "nonce": 1324,
        "hash": "00006d47e76b6a2b1a426bdb71584aa5dd2b1201fb615d57e570a5a7ff6ff05e",
        "previousBlockHash": "0000f9068ddfe372dcdc2b215e347e295a8795e52a5bb2d1ddf50dc61073df69"
        }
        ],
        "pendingTransactions": [],
        "currentNodeUrl": "http://localhost:3001",
        "networkNodes": []
}

console.log('VALID:' , falcon.chainIsValid(bc1.chain));
// falcon.createNewBlock(789457,'OIUOEDJETH8754DHKD','78SHNEG45DER56'); 
// falcon.createNewTransaction(100,'ALEXHT845SJ5TKCJ2','JENN5BG5DF6HT8NG9'); 
// falcon.createNewBlock(548764,'AKMC875E6S1RS9','WPLS214R7T6SJ3G2');
// falcon.createNewTransaction(50,'ALEXHT845SJ5TKCJ2','JENN5BG5DF6HT8NG9'); 
// falcon.createNewTransaction(200,'ALEXHT845SJ5TKCJ2','JENN5BG5DF6HT8NG9'); 
// falcon.createNewTransaction(300,'ALEXHT845SJ5TKCJ2','JENN5BG5DF6HT8NG9');
// falcon.createNewBlock(352315,'JKLHEF8IU32JKB','KJBF23UO283HJK23');

// console.log(falcon.getLastBlock()['index'] + 1);
// var i = 0;
// while(i < falcon.chain.length) {
//     console.log(falcon.chain[i]);
//     i = i + 1;
// }


// falcon.createNewBlock(789457,'OIUOEDJETH8754DHKD','78SHNEG45DER56'); 
// falcon.createNewTransaction(100,'ALEXHT845SJ5TKCJ2','JENN5BG5DF6HT8NG9'); 
// falcon.createNewTransaction(50,'ALEXHT845SJ5TKCJ2','JENN5BG5DF6HT8NG9'); 
// falcon.createNewTransaction(200,'ALEXHT845SJ5TKCJ2','JENN5BG5DF6HT8NG9'); 
// falcon.createNewTransaction(300,'ALEXHT845SJ5TKCJ2','JENN5BG5DF6HT8NG9');
// falcon.createNewBlock(121231,'JKLHEF8IU32JKB','KJBF23UO283HJK23');
// console.log(falcon);

// console.log(falcon.hashBlock(falcon.createNewBlock(121231,'JKLHEF8IU32JKB','KJBF23UO283HJK23')['previousBlockHash'], falcon.createNewBlock(121231,'JKLHEF8IU32JKB','KJBF23UO283HJK23')['transactions'], falcon.createNewBlock(121231,'JKLHEF8IU32JKB','KJBF23UO283HJK23')['nonce']));

// const previousBlockHash = 'OINAISDFN09N09ASDNF90N90ASNDF';
// const currentBlockData = [ 
//     {amount: 600, sender: 'B4CEE9C0E5CD571', recipient: '3A3F6E462D48E9',},
// ]

// // console.log(falcon.hashBlock(previousBlockHash, currentBlockData, 123));
// console.log(falcon.proofOfWork(previousBlockHash, currentBlockData));
