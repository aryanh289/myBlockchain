const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const blockchain = require('./blockchain');
const uuidv4 = require('uuid').v4;
const rp = require('request-promise');

//accessing few data from package.json
const port = process.argv[2];
const currentNodeUrl = process.argv[3];

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

const falcon = new blockchain();

app.get('/blockchain', function(req, res) {
    res.send(falcon);
});

app.post('/transaction', function(req, res) { 
    const newTransaction = req.body;
    const blockIndex = falcon.addTransactionToPendingTransactions(newTransaction);
    res.json({ note: `Transaction will be added to block ${blockIndex}.`});
});

app.get('/mine', function(req, res) {
    // previous block hash
    const lastBlock = falcon.getLastBlock(); 
    const previousBlockHash = lastBlock['hash'];
    // nonce for the block
    const currentBlockData = {
        transactions: falcon.pendingTransactions, 
        index: lastBlock['index'] + 1
    };
    const nonce = falcon.proofOfWork(previousBlockHash, currentBlockData);
    // hash
    const blockHash = falcon.hashBlock(previousBlockHash, currentBlockData, nonce);
    //mining fees to the miner (make a transaction to them)
    const nodeAddress = uuidv4().split('-').join('');
    falcon.createNewTransaction(12.5, "00", nodeAddress);
    // new block creation
    const newBlock = falcon.createNewBlock(nonce, previousBlockHash, blockHash);

    falcon.networkNodes.forEach(networkNodeUrl => 
        { 
            const requestPromises = [];
            const requestOptions = {
                uri: networkNodeUrl + '/receive-new-block',
                method: 'POST',
                body: { newBlock: newBlock },
                json: true
            }; 
            rp(requestOptions);
            requestPromises.push(rp(requestOptions));   
            Promise.all(requestPromises).then(data => {
                const requestOptions = {
                    uri: falcon.currentNodeUrl + '/transaction/broadcast',
                    method: 'POST',
                    body: {
                        amount: 12.5, 
                        sender:"00", 
                        recipient: nodeAddress
                    },
                    json: true
                };
                return rp(requestOptions);
            })     
        })
    res.json(
    {
        note: "New block mined successfully", 
        block: newBlock
    });
    
});


app.post('/receive-new-block', function(req, res) { 
    
    const newBlock = req.body.newBlock;
    const lastBlock = falcon.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
    
    if (correctHash && correctIndex) { 
        falcon.chain.push(newBlock);
        falcon.pendingTransaction = [];
        res.json({note: 'New block received and accepted.', newBlock: newBlock});
    }
    else{ 
        res.json({
            note:'New block rejected.',
            newBlock: newBlock 
        });
    }
});

app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    // added the node url to the main blockchain network array
    if(falcon.networkNodes.indexOf(newNodeUrl) ==  -1)
        falcon.networkNodes.push(newNodeUrl);
    // post the register-node endpoint in all the preexisting nodes
    const regNodesPromises = [];
    falcon.networkNodes.forEach(networkNodesUrl => {
        const requestOptions = {
            uri: networkNodesUrl + '/register-node',
            method: 'POST',
            body: 
            { 
                newNodeUrl: newNodeUrl 
            },
            json: true
        };
        regNodesPromises.push(rp(requestOptions));
    })

    Promise.all(regNodesPromises).then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: 
            {
                allNetworkNodes: [...falcon.networkNodes, falcon.currentNodeUrl]
            },
            json: true
        };
        return rp(bulkRegisterOptions).then (data => {
            res.json({ note: 'New Node registered with network successfully' });
        });
    });

}); 

app.post('/register-node', function(req, res) {

    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = falcon.networkNodes.indexOf(newNodeUrl) == -1; // making sure the node url doesn't preexist
    const notCurrentNode = falcon.currentNodeUrl !== newNodeUrl; // excluding the current node url from all other nodes url
    if(nodeNotAlreadyPresent && notCurrentNode) 
        falcon.networkNodes.push(newNodeUrl);
    
    res.json(
        { note: 'New node registered successfully.' }
    );

});

app.post('/register-nodes-bulk', function (req, res) { 
    
    const allNetworkNodes = req.body.allNetworkNodes; 

    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = falcon.networkNodes.indexOf(networkNodeUrl) == -1; 
        const notCurrentNode = falcon.currentNodeUrl !== networkNodeUrl;
        if(nodeNotAlreadyPresent && notCurrentNode) 
            falcon.networkNodes.push(networkNodeUrl);
    }); 
    res.json(
        {note: 'Bulk registration successful.' }
    );
    
});

app.get('/consensus', function(req, res) {
    falcon.networkNodes.forEach(networkNodeUrl => {
        const requestPromises = [];
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain', 
            method: 'GET',
            json: true
        }
        requestPromises.push(rp(requestOptions));
        Promise.all(requestPromises).then(blockchains => {
            const currentChainLength = falcon.chain.length; 
            let maxChainLength = currentChainLength;
            let newLongestChain = null; 
            blockchains.forEach(blockchain => {
                if (blockchain.chain.length > maxChainLength) { 
                    maxChainLength = blockchain.chain.length; 
                    newLongestChain = blockchain.chain; 
                    newPendingTransactions = blockchain.pendingTransactions;

                    if (!newLongestChain || (newLongestChain && !falcon.chainIsValid(newLongestChain))){
                        res.json({note: 'Current chain has not been replaced.', chain: falcon.chain}); 
                    }
                    else{
                        falcon.chain = newLongestChain; 
                        falcon.pendingTransactions = newPendingTransactions;
                        res.json({note: 'This chain has been replaced.', chain: falcon.chain});
                    }
                }
            });
        })
    });
})

app.post('/transaction/broadcast', function(req, res) {
    const newTransaction = falcon.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    falcon.addTransactionToPendingTransactions(newTransaction);
    const requestPromises = [];
    falcon.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };
        requestPromises.push(rp(requestOptions));
        Promise.all(requestPromises).then(data => {
            // res.json({ note: 'Transaction created and broadcast successfully.'});  
        });
    });
});

app.listen(port, function() {
    console.log(`Server has been started on ${port}`);
});