# Crowdsale

Code for the Odyssey token sale.<br>
⚠️ Warning! ⚠️
This code is NOT ready for production.
Onessus and its developers claim no responsibility for any financial loss resulting from the use of this code.
All rights are reserved.

## Installation

Clone the repo:<br>
`git clone git@github.com:Onessus/crowdsale.git`<br>

Install Truffle and project depencies:<br>
`npm install -g truffle`<br>
`cd crowdsale`<br>
`npm install`<br>

Install Metamask, preferably in Chrome/Chromium:<br>
https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=chrome-app-launcher-info-dialog

Open Metamask, click the hamburger icon in the top right, and click Settings.<br>
Add the following RPC URL: http://localhost:9545<br>

If any contract .json files exist in /build/contracts, delete them.<br>
`rm /build/contracts/*`<br>

Enter into Truffle's development and testrpc console.<br>
`truffle develop`<br>

Compile any contracts<br>
`compile`<br>

Migrate the contracts<br>
`migrate --reset`<br>

Exit out of the truffle development console and run<br>
`npm run dev`
