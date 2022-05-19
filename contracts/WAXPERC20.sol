pragma solidity 0.6.12;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";

/**
 * @dev Vanilla upgradeable {ERC20} "WAXP" token:
 *
 */
contract WAXPERC20UpgradeSafe is Initializable, OwnableUpgradeSafe, ERC20BurnableUpgradeSafe {
    uint8 public constant DECIMALS = 8;                         // The number of decimals for display

    /**
     * See {ERC20-constructor}.
     */

    function initialize(address escrow) public initializer {
        ERC20UpgradeSafe.__ERC20_init("WAXP Token", "WAXP");
        _setupDecimals(DECIMALS);
        uint256 INITIAL_SUPPLY = 386482894311326596;  // supply specified in base units
        _mint(escrow, INITIAL_SUPPLY);
        __Ownable_init();
        require(totalSupply() == INITIAL_SUPPLY, "WAXP: totalSupply must equal 3.7 million");
    }

    /**
     * @dev Destroys `amount` tokens from the contract owner.
     *
     * See {ERC20-_burn}.
     * - only owner allow to call
     */
    function burn(uint256 amount) public override onlyOwner {
        super.burn(amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's
     * allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `amount`.
     * - only owner allow to call
     */
    function burnFrom(address account, uint256 amount) public override onlyOwner {
        super.burnFrom(account, amount);
    }
}
