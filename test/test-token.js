// Create a contract object from a compilation artifact
const truffleAssert = require('truffle-assertions');
const WAXPERC20 = artifacts.require("WAXPERC20UpgradeSafe");

contract('WAXPERC20', accounts => {
  const [ owner, escrow, user ] = accounts;
  const initialTotalSupply = web3.utils.toBN('386482894311326596');
  let waxpERC20contract;
  let oldWaxTokenContract;

  beforeEach(async function () {
    this.timeout(10000);
    // Deploy a new WAXPERC20 contract for each test
    waxpERC20contract = await WAXPERC20.new();
    oldWaxTokenContract = await WAXPERC20.new(); // simulate old WAX ERC20 contract
    await waxpERC20contract.initialize(escrow, { from: owner });
    await oldWaxTokenContract.initialize(escrow, { from: owner });
    await waxpERC20contract.setWaxToken(oldWaxTokenContract.address, { from: owner});
  });

  it('initializes', async function () {
    // Test if the supply is as expected
    expect((await waxpERC20contract.totalSupply()).eq(initialTotalSupply)).to.be.true;
    expect((await waxpERC20contract.balanceOf(escrow)).eq(initialTotalSupply)).to.be.true;
    expect((await waxpERC20contract.symbol())).to.equal('WAXP');
    expect((await waxpERC20contract.name())).to.equal('WAXP Token');
    expect((await waxpERC20contract.decimals()).eq(web3.utils.toBN('8'))).to.be.true;

    await truffleAssert.reverts(
      waxpERC20contract.initialize(escrow, { from: escrow }),
      'contract is already initialized'
    );
  });

  it('transfers', async function () {
    const amount = web3.utils.toBN('100');
    await waxpERC20contract.transfer(user, amount, { from: escrow });
    expect((await waxpERC20contract.balanceOf(escrow)).eq(initialTotalSupply.sub(amount))).to.be.true;
    expect((await waxpERC20contract.balanceOf(user)).eq(amount)).to.be.true;
    await truffleAssert.reverts(
      waxpERC20contract.transfer(user, initialTotalSupply, { from: escrow }),
      'transfer amount exceeds balance'
    );
  });

  it('should not allow transfer() when to is 0x0000000000000000000000000000000000000000', async function() {
    const amount = web3.utils.toBN('100');
    await truffleAssert.reverts(
      waxpERC20contract.transfer('0x0000000000000000000000000000000000000000', amount, { from: escrow }),
      'transfer to the zero address'
    );
  })

  it('should allow transferFrom(), when properly approved, when unpaused', async function() {
    const amount = web3.utils.toBN('100');
    let receipt = await waxpERC20contract.approve(user, amount, { from: escrow });
    truffleAssert.eventEmitted(receipt, 'Approval', (ev) => {
      return ev.value.eq(amount)
    }, 'Invalid approval event');
    await waxpERC20contract.transferFrom(escrow, user, amount, { from: user });
    expect((await waxpERC20contract.balanceOf(escrow)).eq(initialTotalSupply.sub(amount))).to.be.true;
    expect((await waxpERC20contract.balanceOf(user)).eq(amount)).to.be.true;
  })

  it('should allow approve(), and allowance() when unpaused', async function() {
    const amount = web3.utils.toBN('100');
    let receipt = await waxpERC20contract.approve(user, amount, { from: escrow });
    truffleAssert.eventEmitted(receipt, 'Approval', (ev) => {
      return ev.value.eq(amount)
    }, 'Invalid approval event');
    expect((await waxpERC20contract.allowance(escrow, user, { from: escrow })).eq(amount)).to.be.true;
    await waxpERC20contract.approve(user, 0, { from: escrow });
  })

  it('should not allow transferFrom() when to is 0x0000000000000000000000000000000000000000', async function() {
    const amount = web3.utils.toBN('100');
    await waxpERC20contract.approve(user, amount, { from: escrow });
    await truffleAssert.reverts(
      waxpERC20contract.transferFrom(escrow, '0x0000000000000000000000000000000000000000', amount, { from: user }),
      'transfer to the zero address'
    );
    await waxpERC20contract.approve(user, 0, { from: escrow });
  })

  it('should not allow burn token if not contract owner', async function() {
    const amount = web3.utils.toBN('100');
    await waxpERC20contract.transfer(user, amount, { from: escrow });

    await truffleAssert.reverts(
      waxpERC20contract.burn(amount, { from: user }),
      'Ownable: caller is not the owner'
    );

    const userBalance = await waxpERC20contract.balanceOf(user);
    expect(userBalance.eq(amount)).to.be.true;
  });

  it('should allow contract owner to burn token', async function() {
    const amount = web3.utils.toBN('10000000000000');
    await waxpERC20contract.transfer(owner, amount, { from: escrow });

    await waxpERC20contract.burn(amount, { from: owner });

    const totalSupply = await waxpERC20contract.totalSupply();
    const userBalance = await waxpERC20contract.balanceOf(owner);
    expect(userBalance.eq(web3.utils.toBN('0'))).to.be.true;
    expect(totalSupply.eq(web3.utils.toBN('386472894311326596'))).to.be.true;
  });

  it('should not allow to burnFrom if not contract owner', async function() {
    const burnAmount = web3.utils.toBN('10000000000000');
    await waxpERC20contract.approve(user, burnAmount, { from: escrow });
    await truffleAssert.reverts(
      waxpERC20contract.burnFrom(escrow, burnAmount, { from: user }),
      'Ownable: caller is not the owner'
    );

    const userAllowance = await waxpERC20contract.allowance(escrow, user);
    expect(userAllowance.eq(burnAmount)).to.be.true;
  });

  it('should allow contract owner to burnFrom', async function() {
    const burnAmount = web3.utils.toBN('10000000000000');
    await waxpERC20contract.approve(owner, burnAmount, { from: escrow });

    await waxpERC20contract.burnFrom(escrow, burnAmount, { from: owner });
    const totalSupply = await waxpERC20contract.totalSupply();
    const userAllowance = await waxpERC20contract.allowance(escrow, owner);
    expect(totalSupply.eq(web3.utils.toBN('386472894311326596'))).to.be.true;
    expect(userAllowance.toString()).to.equal('0');
  });

  it('should not allow swapogwax if not enough allowance', async function() {
    const swapAmount = web3.utils.toBN('10000000000000');
    await oldWaxTokenContract.transfer(user, swapAmount, { from: escrow });

    await truffleAssert.reverts(
      waxpERC20contract.swapogwax(swapAmount, { from: user }),
      'ERR::NOT_ENOUGH_ALLOWANCE'
    )

    await waxpERC20contract.approve(owner, swapAmount.sub(web3.utils.toBN('100000000000')), { from: escrow });

    await truffleAssert.reverts( // still not enough allowance
      waxpERC20contract.swapogwax(swapAmount, { from: user }),
      'ERR::NOT_ENOUGH_ALLOWANCE'
    )
  });

  it('should able to swapogwax to get new waxp token', async function() {
    const swapAmount = web3.utils.toBN('10000000000000');
    await waxpERC20contract.transfer(waxpERC20contract.address, swapAmount, { from: escrow });
    await oldWaxTokenContract.transfer(user, swapAmount, { from: escrow });

    await oldWaxTokenContract.approve(waxpERC20contract.address, swapAmount, { from: user });

    const userBalanceBeforeSwap = await waxpERC20contract.balanceOf(user);
    const receipt = await waxpERC20contract.swapogwax(swapAmount, { from: user });
    const userBalanceAfterSwap = await waxpERC20contract.balanceOf(user);
    expect(userBalanceBeforeSwap.add(swapAmount).eq(userBalanceAfterSwap)).to.be.true;

    truffleAssert.eventEmitted(receipt, 'TokenSwap', (ev) => {
      return ev.from === user && ev.amount.eq(swapAmount)
    }, 'Invalid TokenSwap event');
  });
});