const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())


const {abi, evm } = require('../compile')


let lottery
let accounts


beforeEach(async ()=>{
	accounts = await web3.eth.getAccounts()
	lottery = await new web3.eth.Contract(abi)
	.deploy({
		data: evm.bytecode.object
	})
	.send({from: accounts[0], gas: '1000000'})
})


// console.log("O.01 ETH", web3.utils.toWei('0.01', 'ether'))


describe('Lottery', ()=>{

	it('deploys the contract', ()=>{
		assert.ok(lottery.options.address)
	})

	it('allows one account to enter', async ()=>{

		const value = web3.utils.toWei('0.02', 'ether')
		console.log("value : ", value)
		console.log(" typeof value : ", typeof(value))

		const enterTx = await lottery.methods.enter().send({
			from: accounts[0],
			value: value
		})

		const players = await lottery.methods.getPlayers().call({from: accounts[0]})

		assert.equal(accounts[0], players[0])
		assert.equal(1, players.length)

	})




})


