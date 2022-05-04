const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

const { BN, expectEvent, expectRevert, send } = require('@openzeppelin/test-helpers');

// Create a contract object from a compilation artifact
const WAXPERC20 = contract.fromArtifact('WAXPERC20UpgradeSafe');

describe('WAXPERC20', function () {
  const [ owner, escrow, user ] = accounts;
  const initialTotalSupply = new BN('386482894311326596');

  beforeEach(async function () {
    this.timeout(5000);
    // Deploy a new WAXPERC20 contract for each test
    this.contract = await WAXPERC20.new({ from: owner });
    await this.contract.initialize(escrow, { from: owner });
  });

  it('initializes', async function () {
    // Test if the supply is as expected
    expect((await this.contract.totalSupply())).to.be.bignumber.equal(initialTotalSupply);
    expect((await this.contract.balanceOf(escrow))).to.be.bignumber.equal(initialTotalSupply);
    expect((await this.contract.symbol())).to.equal('WAXP');
    expect((await this.contract.name())).to.equal('WAXP Token');
    expect((await this.contract.decimals())).to.be.bignumber.equal(new BN(8));

    await expectRevert(
      this.contract.initialize(escrow, { from: escrow }),
      'Contract instance has already been initialized'
    );
  });

  it('transfers', async function () {
    const amount = new BN('100');
    await this.contract.transfer(user, amount, { from: escrow });
    expect((await this.contract.balanceOf(escrow))).to.be.bignumber.equal(initialTotalSupply.sub(amount));
    expect((await this.contract.balanceOf(user))).to.be.bignumber.equal(amount);
    await expectRevert(
      this.contract.transfer(user, initialTotalSupply, { from: escrow }),
      'transfer amount exceeds balance'
    );
  });
  
  it('should not allow transfer() when to is null', async function () {
    const amount = new BN('100');
    await expectRevert(
      this.contract.transfer(null, amount, { from: escrow }),
      'invalid address'
    );
  });

  it('should not allow transfer() when to is 0x0000000000000000000000000000000000000000', async function() {
    const amount = new BN('100');
    await expectRevert(
      this.contract.transfer('0x0000000000000000000000000000000000000000', amount, { from: escrow }),
      'transfer to the zero address'
    );
  })

  it.skip('should not allow transfer() when to is the contract address', async function() {
    const amount = new BN('100');
    await expectRevert(
      this.contract.transfer(this.contract.address, amount, { from: escrow }),
      'transfer to the zero address'
    );
  });

  it('should allow transferFrom(), when properly approved, when unpaused', async function() {
    const amount = new BN('100');
    let receipt = await this.contract.approve(user, amount, { from: escrow });
    expectEvent(receipt, 'Approval', { value: amount });
    await this.contract.transferFrom(escrow, user, amount, { from: user });
    expect((await this.contract.balanceOf(escrow))).to.be.bignumber.equal(initialTotalSupply.sub(amount));
    expect((await this.contract.balanceOf(user))).to.be.bignumber.equal(amount);
  })

  it('should allow approve(), and allowance() when unpaused', async function() {
    const amount = new BN('100');
    let receipt = await this.contract.approve(user, amount, { from: escrow });
    expectEvent(receipt, 'Approval', { value: amount });
    expect(await this.contract.allowance(escrow, user, { from: escrow })).to.be.bignumber.equal(amount);
    await this.contract.approve(user, 0, { from: escrow });
  })

  it('should not allow transferFrom() when to is null', async function() {
    const amount = new BN('100');
    await this.contract.approve(user, amount, { from: escrow });
    await expectRevert(
      this.contract.transferFrom(escrow, null, amount, { from: user }),
      'invalid address'
    );
    await this.contract.approve(user, 0, { from: escrow });
  })

  it('should not allow transferFrom() when to is 0x0000000000000000000000000000000000000000', async function() {
    const amount = new BN('100');
    await this.contract.approve(user, amount, { from: escrow });
    await expectRevert(
      this.contract.transferFrom(escrow, '0x0000000000000000000000000000000000000000', amount, { from: user }),
      'transfer to the zero address'
    );
    await this.contract.approve(user, 0, { from: escrow });
  })

  it.skip('should not allow transferFrom() when to is the contract address', async function() {
    const amount = new BN('100');
    await this.contract.approve(user, amount, { from: escrow });
    await expectRevert(
      this.contract.transferFrom(escrow, this.contract.address, amount, { from: user }),
      'transfer to the zero address'
    );
    await this.contract.approve(user, 0, { from: escrow });
  });

  it('should not be able to send ETH to contract', async function() {
    await send.ether(escrow, user, '1');
    await expectRevert.unspecified(
      send.ether(escrow, this.contract.address, '1')
    );
  });

  it('should not allow burn token if not contract owner', async function() {
    const amount = new BN('10000000000000');
    await this.contract.transfer(user, amount, { from: escrow });

    await expectRevert(
      this.contract.burn(amount, { from: user }),
      'Ownable: caller is not the owner'
    );

    const userBalance = await this.contract.balanceOf(user);
    expect(userBalance.toString()).to.equal('10000000000000');
  });

  it('should allow contract owner to burn token', async function() {
    const amount = new BN('10000000000000');
    await this.contract.transfer(owner, amount, { from: escrow });

    const ownerGet = await this.contract.owner();

    await this.contract.burn(amount, { from: owner });

    const totalSupply = await this.contract.totalSupply();
    const userBalance = await this.contract.balanceOf(owner);
    expect(userBalance.toString()).to.equal('0');
    expect(totalSupply.toString()).to.equal('386472894311326596');
  });

  it('should not allow to burnFrom if not contract owner', async function() {
    const burnAmount = new BN('1000000');
    await this.contract.approve(user, burnAmount, { from: escrow });
    await expectRevert(
      this.contract.burnFrom(escrow, burnAmount, { from: user }),
      'Ownable: caller is not the owner'
    );

    const userAllowance = await this.contract.allowance(escrow, user);
    expect(userAllowance.toString()).to.equal('1000000');
  });

  it('should allow contract owner to burnFrom', async function() {
    const burnAmount = new BN('10000000000000');
    await this.contract.approve(owner, burnAmount, { from: escrow });

    await this.contract.burnFrom(escrow, burnAmount, { from: owner });
    const totalSupply = await this.contract.totalSupply();
    const userAllowance = await this.contract.allowance(escrow, owner);
    expect(totalSupply.toString()).to.equal('386472894311326596');
    expect(userAllowance.toString()).to.equal('0');
  });
});