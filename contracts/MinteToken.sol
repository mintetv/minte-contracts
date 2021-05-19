// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20SnapshotUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";



contract MinteToken is Initializable,
    OwnableUpgradeable,
    ERC20PausableUpgradeable,
    ERC20BurnableUpgradeable,
    ERC20SnapshotUpgradeable,
    ERC20PermitUpgradeable
  {


  using SafeMathUpgradeable for uint256;
  mapping(bytes32 => address) private _contractAddresses;


  /* constructor function */
  function initialize(
        address admin,
        address recipient,
        uint256 supply
    ) external initializer {
        __Ownable_init();
        __ERC20_init("Minte", unicode"🎮");
        __ERC20Pausable_init();
        __ERC20Burnable_init();
        __ERC20Snapshot_init();
        __ERC20Permit_init("Minte");

        // mint initial supply
        _mint(recipient, supply);
    }


  function setContractAddress(bytes32 _key, address _address) external
    onlyOwner {
      _contractAddresses[_key] = _address;
  }


  function pause() external
    onlyOwner {
      _pause();
  }

  function unpause() external
    onlyOwner{
      _unpause();
  }



  function getContractAddress(bytes32 _key) external view
    returns(address) {
      return _contractAddresses[_key];
  }


  function _beforeTokenTransfer(address from, address to, uint256 amount) internal override
    (ERC20Upgradeable, ERC20PausableUpgradeable, ERC20SnapshotUpgradeable) {
        ERC20SnapshotUpgradeable._beforeTokenTransfer(from, to, amount);
  }



}
