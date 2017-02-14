var Bitcoin = require('bitcoinjs-lib');
var Buffer = require('buffer').Buffer
console.log(Bitcoin)

// ### Test vectors
var txHex = "0100000001974777ae8d608b83ebbbd84af66d5f40c19604d095380b939a7345c4009a1739010000006a473044022004679c20b22667a5565ef6d863ce30ebb58fdab04ae1ae61d44a6dfd37e2090c02200b52d07804198ac625d70f412a675e9c016a763b953385ddddc9e67da44ae58101210390f94e9b815cf533f2a436ea32143fa7a4444ad92656ccc302cede228a997b0efeffffff020024fd3d000000001976a91492429c9252f2ae348e82d140881a6f9c607bb8dc88ac2f6c2711000000001976a91447df37ca3e401bfb87b5bce408a36e5238c3c72f88ac16e90600"
var redeemScriptHex = "00"
var changeValue = 100000
// ### Test vectors

var keyPair = new Bitcoin.ECPair.makeRandom();

// Sign only a single output, unless changeValue==0, in which case we don't sign any outputs at all
function getHashFlag(changeVal) {
	var hashFlag = (changeVal == 0) ? Bitcoin.Transaction.SIGHASH_NONE : Bitcoin.Transaction.SIGHASH_SINGLE;
	return (hashFlag | Bitcoin.Transaction.SIGHASH_ANYONECANPAY);
}

function TxState(txHex, rdmScrHex) {
	this.tx = Bitcoin.Transaction.fromHex(txHex);
  this.script = new Bitcoin.script.fromASM(rdmScrHex);
}
	
TxState.prototype.createPaySig =
	function(changeVal) {
  	this.tx.outs[0].value = changeVal;
		var txHash = this.tx.hashForSignature(0, this.script, getHashFlag(changeVal));
    return (keyPair.sign(txHash));
  }

var state = new TxState(txHex, redeemScriptHex);
console.log( state.createPaySig(changeValue - 10) );








