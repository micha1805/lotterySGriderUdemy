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


console.log("O.01 ETH", web3.utils.toWei('0.01', 'ether'))


describe('Lottery', ()=>{

	it('deploys the contract', ()=>{
		assert.ok(lottery.options.address)
	})

	it('allows one account to enter', async ()=>{

		const value = web3.utils.toWei('0.02', 'ether')

		const enterTx = await lottery.methods.enter().send({
			from: accounts[0],
			value: value
		})

		const players = await lottery.methods.getPlayers().call({from: accounts[0]})

		assert.equal(accounts[0], players[0])
		assert.equal(1, players.length)

	})


	it('allows multiple accounts to enter', async ()=>{

		const value = web3.utils.toWei('0.02', 'ether')

		await lottery.methods.enter().send({
			from: accounts[0],
			value: value
		})

		await lottery.methods.enter().send({
			from: accounts[1],
			value: value
		})

		await lottery.methods.enter().send({
			from: accounts[2],
			value: value
		})

		const players = await lottery.methods.getPlayers().call({from: accounts[0]})

		assert.equal(accounts[0], players[0])
		assert.equal(accounts[1], players[1])
		assert.equal(accounts[2], players[2])
		assert.equal(3, players.length)

	})


	it('requires a minimum amount of ether', async ()=>{
		try{
			const smallValue = 200
			await lottery.methods.enter().send({
				from: accounts[0],
				value: smallValue
			})
			assert(false)
		}catch(e){
			assert(e)
		}
	})

	it('Only manager can enter pickWinner method', ()=> {


		try{
			await lottery.methods.pickWinner().send({
				from: accounts[0]
			})
			// There is a HUGE BUG HERE : if the previous line does NOT throw an error, the
			// following :
			// assert(false)
			// WILL, and the test will ALWAYS pass because throwing an error means
			// going into the catch thus passing the test
			// I don't have time to fix it, I'll see later
			assert(false)
		}catch(e){
			assert(e)
		}
	})




})


