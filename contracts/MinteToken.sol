// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20SnapshotUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";



contract MinteToken is Initializable,
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    ERC20SnapshotUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ERC20PermitUpgradeable
  {

  /* Define Token Roles */
  bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  using SafeMathUpgradeable for uint256;
  mapping(bytes32 => address) private _contractAddresses;


  /* constructor function */
  function initialize(
        address admin,
        address recipient,
        uint256 supply
    ) external initializer {
        __AccessControl_init();

        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(SNAPSHOT_ROLE, admin);
        _setupRole(PAUSER_ROLE, admin);
        _setupRole(MINTER_ROLE, admin);

        __ERC20_init("Minte", unicode"🎮");
        __Pausable_init();
        __ERC20Burnable_init();
        __ERC20Snapshot_init();
        __ERC20Permit_init("Minte");

        // mint initial supply
        _mint(recipient, supply);
  }


  function snapshot() public {
      require(hasRole(SNAPSHOT_ROLE, msg.sender));
      _snapshot();
  }

  function pause() public {
      require(hasRole(PAUSER_ROLE, msg.sender));
      _pause();
  }

  function unpause() public {
      require(hasRole(PAUSER_ROLE, msg.sender));
      _unpause();
  }

  function mint(address to, uint256 amount) public {
      require(hasRole(MINTER_ROLE, msg.sender));
      _mint(to, amount);
  }

  function _beforeTokenTransfer(address from, address to, uint256 amount)
      internal
      whenNotPaused
      override(ERC20Upgradeable, ERC20SnapshotUpgradeable)
  {
      super._beforeTokenTransfer(from, to, amount);
  }


  /* get and set contract */
  function getContractAddress(bytes32 _key) external view
    returns(address) {
      return _contractAddresses[_key];
  }

  function setContractAddress(bytes32 _key, address _address) external {
      require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));
      _contractAddresses[_key] = _address;
  }
  
}
