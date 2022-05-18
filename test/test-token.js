// Create a contract object from a compilation artifact
const truffleAssert = require('truffle-assertions');

const WAXPERC20 = artifacts.require("WAXPERC20UpgradeSafe");

contract('WAXPERC20', accounts => {
  const [ owner, escrow, user ] = accounts;
  const initialTotalSupply = web3.utils.toBN('386482894311326596');
  let contract;

  beforeEach(async function () {
    this.timeout(5000);
    // Deploy a new WAXPERC20 contract for each test
    contract = await WAXPERC20.new();
    await contract.initialize(escrow, { from: owner });
  });

  it('initializes', async function () {
    // Test if the supply is as expected
    expect((await contract.totalSupply()).eq(initialTotalSupply)).to.be.true;
    expect((await contract.balanceOf(escrow)).eq(initialTotalSupply)).to.be.true;
    expect((await contract.symbol())).to.equal('WAXP');
    expect((await contract.name())).to.equal('WAXP Token');
    expect((await contract.decimals()).eq(web3.utils.toBN('8'))).to.be.true;

    await truffleAssert.reverts(
      contract.initialize(escrow, { from: escrow }),
      'Contract instance has already been initialized'
    );
  });

  it('transfers', async function () {
    const amount = web3.utils.toBN('100');
    await contract.transfer(user, amount, { from: escrow });
    expect((await contract.balanceOf(escrow)).eq(initialTotalSupply.sub(amount))).to.be.true;
    expect((await contract.balanceOf(user)).eq(amount)).to.be.true;
    await truffleAssert.reverts(
      contract.transfer(user, initialTotalSupply, { from: escrow }),
      'transfer amount exceeds balance'
    );
  });

  it('should not allow transfer() when to is 0x0000000000000000000000000000000000000000', async function() {
    const amount = web3.utils.toBN('100');
    await truffleAssert.reverts(
      contract.transfer('0x0000000000000000000000000000000000000000', amount, { from: escrow }),
      'transfer to the zero address'
    );
  })

  it('should allow transferFrom(), when properly approved, when unpaused', async function() {
    const amount = web3.utils.toBN('100');
    let receipt = await contract.approve(user, amount, { from: escrow });
    truffleAssert.eventEmitted(receipt, 'Approval', (ev) => {
      return ev.value = amount
    }, 'Invalid approval event');
    await contract.transferFrom(escrow, user, amount, { from: user });
    expect((await contract.balanceOf(escrow)).eq(initialTotalSupply.sub(amount))).to.be.true;
    expect((await contract.balanceOf(user)).eq(amount)).to.be.true;
  })

  it('should allow approve(), and allowance() when unpaused', async function() {
    const amount = web3.utils.toBN('100');
    let receipt = await contract.approve(user, amount, { from: escrow });
    truffleAssert.eventEmitted(receipt, 'Approval', (ev) => {
      return ev.value = amount
    }, 'Invalid approval event');
    expect((await contract.allowance(escrow, user, { from: escrow })).eq(amount)).to.be.true;
    await contract.approve(user, 0, { from: escrow });
  })

  it('should not allow transferFrom() when to is 0x0000000000000000000000000000000000000000', async function() {
    const amount = web3.utils.toBN('100');
    await contract.approve(user, amount, { from: escrow });
    await truffleAssert.reverts(
      contract.transferFrom(escrow, '0x0000000000000000000000000000000000000000', amount, { from: user }),
      'transfer to the zero address'
    );
    await contract.approve(user, 0, { from: escrow });
  })

  it('should not allow burn token if not contract owner', async function() {
    const amount = web3.utils.toBN('100');
    await contract.transfer(user, amount, { from: escrow });

    await truffleAssert.reverts(
      contract.burn(amount, { from: user }),
      'Ownable: caller is not the owner'
    );

    const userBalance = await contract.balanceOf(user);
    expect(userBalance.eq(amount)).to.be.true;
  });

  it('should allow contract owner to burn token', async function() {
    const amount = web3.utils.toBN('10000000000000');
    await contract.transfer(owner, amount, { from: escrow });

    await contract.burn(amount, { from: owner });

    const totalSupply = await contract.totalSupply();
    const userBalance = await contract.balanceOf(owner);
    expect(userBalance.eq(web3.utils.toBN('0'))).to.be.true;
    expect(totalSupply.eq(web3.utils.toBN('386472894311326596'))).to.be.true;
  });

  it('should not allow to burnFrom if not contract owner', async function() {
    const burnAmount = web3.utils.toBN('10000000000000');
    await contract.approve(user, burnAmount, { from: escrow });
    await truffleAssert.reverts(
      contract.burnFrom(escrow, burnAmount, { from: user }),
      'Ownable: caller is not the owner'
    );

    const userAllowance = await contract.allowance(escrow, user);
    expect(userAllowance.eq(burnAmount)).to.be.true;
  });

  it('should allow contract owner to burnFrom', async function() {
    const burnAmount = web3.utils.toBN('10000000000000');
    await contract.approve(owner, burnAmount, { from: escrow });

    await contract.burnFrom(escrow, burnAmount, { from: owner });
    const totalSupply = await contract.totalSupply();
    const userAllowance = await contract.allowance(escrow, owner);
    expect(totalSupply.eq(web3.utils.toBN('386472894311326596'))).to.be.true;
    expect(userAllowance.toString()).to.equal('0');
  });
});