//const Splitter = artifacts.require('./Splitter.sol');
//const Promise = require('bluebird');
//
//if (typeof web3.eth.getBlockPromise !== "function") {
//    Promise.promisifyAll(web3.eth, { suffix: "Promise" });
//}
//
//contract('Splitter', function(accounts) {
//    let spl, bob, alice, carol, transferValue, sum;
//
//    before("deploy new Splitter", async () => {
//        spl = await Splitter.new({from: accounts[3]});
//        bob = accounts[0];
//        alice = accounts[1];
//        carol = accounts[2];
//        transferValue = 12345;
//        sum = 0;
//    });
//
//
//    it('should split ether between peers', async () => {
//        let l = await spl.splitLength.call();
//
//        web3.eth.sendTransaction({to: spl.address, from: carol, value: transferValue});
//
//        for (var i = 0; i < l; i++) {
//            let addr = await spl.splitAddrs.call(i);
//            let percent = await spl.split.call(addr);
//            let val = transferValue * percent.div(10000);
//            let bal = await spl.balances.call(addr);
//            sum += bal.toNumber();
//            assert.equal(bal.toNumber(), Math.floor(val, 0), "Value incorrect for address " + addr);
//        }
//    });
//
//    it('should allow to withdraw funds', async () => {
//        var bobWBal = await spl.balances.call(bob);
//        var aliceWBal = await spl.balances.call(alice);
//
//        // withdraw bob
//        var bobBal = await web3.eth.getBalancePromise(bob);
//        var tx = await spl.withdraw({from: bob, gas: 200000});
//        var gasUsed = tx.receipt.gasUsed;
//        tx = web3.eth.getTransaction(tx.tx);
//        var gasPrice = tx.gasPrice.toNumber();
//
//        var txCost = gasPrice * gasUsed;
//        var bobNewBal = await web3.eth.getBalancePromise(bob);
//        assert(bobNewBal.plus(txCost).minus(bobWBal).toNumber(), bobBal.toNumber(), "Bob after withdraw balance incorrect.");
//        var bobWBal2 = await spl.balances.call(bob);
//        assert.equal(bobWBal2.toNumber(), 0 , "Splitter bob's balance incorrect.");
//
//        // withdraw alice
//        var aliceBal = await web3.eth.getBalancePromise(alice);
//        var tx = await spl.withdraw({from: alice, gas: 2000000});
//        var gasUsed = tx.receipt.gasUsed;
//        tx = web3.eth.getTransaction(tx.tx);
//        var gasPrice = tx.gasPrice.toNumber();
//
//        var txCost = gasPrice * gasUsed;
//        var aliceNewBal = await web3.eth.getBalancePromise(alice);
//        assert.equal(aliceNewBal.plus(txCost).minus(aliceWBal).toNumber(), aliceBal.toNumber(), "alice after withdraw balance incorrect.");
//        var aliceWBal2 = await spl.balances.call(bob);
//        assert.equal(aliceWBal2.toNumber(), 0 , "Splitter bob's balance incorrect.");
//    });
//
//    it('should allow to withdraw leftovers by owner', async () => {
//        let owner = accounts[3];
//        let left = transferValue - sum;
//
//        let splBal = await web3.eth.getBalancePromise(spl.address);
//
//        // withdraw bob
//        var ownerBal = await web3.eth.getBalancePromise(owner);
//        var tx = await spl.withdrawLeftover({from: owner});
//        var gasUsed = tx.receipt.gasUsed;
//        tx = web3.eth.getTransaction(tx.tx);
//        var gasPrice = tx.gasPrice.toNumber();
//
//        var txCost = gasPrice * gasUsed;
//        var ownerNewBal = await web3.eth.getBalancePromise(owner);
//        assert.equal(ownerNewBal.plus(txCost).minus(left).toNumber(), ownerBal.toNumber(), "Bob after withdraw balance incorrect.");
//
//    });
//
//});
//
