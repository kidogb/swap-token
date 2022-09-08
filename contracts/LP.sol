// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC20.sol";

abstract contract LP is ERC20 {

    function mintFrom(address account, uint256 _amount) public {
        _mint(account, _amount);
    }

    function burnFrom(address account, uint256 _amount) public {
        _spendAllowance(account, msg.sender, _amount);
        _burn(account, _amount);
    }
}
