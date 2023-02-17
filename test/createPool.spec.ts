import '@nomiclabs/hardhat-ethers'
import { ethers, hardhatArguments } from 'hardhat'
import { Contract } from 'ethers'
import { BigNumberish } from '@ethersproject/bignumber'


import {
    abi as FACTORY_ABI,
    bytecode as FACTORY_BYTECODE,
  } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'

//import utils from 'node_modules/@openzeppelin/contracts/utils'

const fromUnit = (amount: any, unit: string | BigNumberish = 'ether') => ethers.utils.formatUnits(amount.toString(), unit)
const toUnit = (amount: any, unit = 'ether') => ethers.utils.parseUnits(amount.toString(), unit)


// const toUnit = utils.toUnit
// const fromUnit = utils.fromUnit


describe('CreatePoolTest', () => {

    let tokenFactory
    let deployer, user
    let tokenA, tokenB
    let uniswapV3Factory
    let poolHash
    let poolAddress
    let uniswapV3Pool
    let amount0, amount1
    let testUniswapV3CalleeFactory
    let testUniswapV3Callee

    before(async() => {
        [deployer, user] = await ethers.getSigners()
        tokenFactory = await ethers.getContractFactory("TestERC20")
        tokenA = await tokenFactory.deploy(0) // using uniswapV3_TestERC20
        tokenB = await tokenFactory.deploy(0) // using uniswapV3_TestERC20
        uniswapV3Factory = await ethers.getContractAt("IUniswapV3Factory", "0x1F98431c8aD98523631AE4a59f267346ea31F984")

        await tokenA.mint(deployer.address, toUnit(10000))
        await tokenA.mint(user.address, toUnit(10000))
        await tokenB.mint(deployer.address, toUnit(10000))
        await tokenB.mint(user.address, toUnit(10000))

        //console.log(await tokenA.balanceOf(deployer.address))
        console.log("hello")

    })

    // it("Create Pool", async() => {
    //     await tokenA.approve(uniswapV3Factory.address, toUnit(200))
    //     await tokenB.approve(uniswapV3Factory.address, toUnit(200))
    //     poolAddress = await uniswapV3Factory.createPool(tokenA.address, tokenB.address, 100)
    // })

    it("mint new position", async() => {
        await tokenA.approve(deployer.address, toUnit(200))
        await tokenB.approve(deployer.address, toUnit(200))
        poolHash = await uniswapV3Factory.createPool(tokenA.address, tokenB.address, 10000) // 10000: 1%, 3000: 0.3%, 500: 0.05%
        console.log(poolHash)
        poolAddress = await uniswapV3Factory.getPool(tokenA.address, tokenB.address, 10000)
        console.log("pool address: ", poolAddress)
        uniswapV3Pool = await ethers.getContractAt("IUniswapV3Pool", poolAddress)
        await uniswapV3Pool.initialize(toUnit(1))
        console.log("tick spacing: ", await uniswapV3Pool.tickSpacing())

        // function mint(
        //     address pool,
        //     address recipient,
        //     int24 tickLower,
        //     int24 tickUpper,
        //     uint128 amount
        // ) external {
        //     IUniswapV3Pool(pool).mint(recipient, tickLower, tickUpper, amount, abi.encode(msg.sender));
        // }

        testUniswapV3CalleeFactory = await ethers.getContractFactory("TestUniswapV3Callee")
        testUniswapV3Callee = await testUniswapV3CalleeFactory.deploy()
        await tokenA.approve(testUniswapV3Callee.address, ethers.constants.MaxUint256)
        await tokenB.approve(testUniswapV3Callee.address, ethers.constants.MaxUint256)
        await testUniswapV3Callee.mint(poolAddress, deployer.address, -400, 400, toUnit(100))


        // let poolKey:Object
        // poolKey = {
        //     token0: tokenA.address,
        //     token1: tokenB.address,
        //     fee: 10000
        // }
        // let mintCallBackData: Object
        // mintCallBackData = {
        //     poolKey: poolKey,
        //     payer: deployer.address
        // }


        // const data = ethers.utils.defaultAbiCoder.encode(["tuple(tuple(address, address, uint24), address)"], [[[tokenA.address, tokenB.address, 10000], deployer.address]])
        // console.log(data)
        

        // await uniswapV3Pool.mint(deployer.address, -400, 400, toUnit(100), data)


    })


})