const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    let name_ = "YouBond";  // bond name
    let isin_ = "YBd";  // bond symbol
    let expectedSupply_ = ethers.parseUnits("1000000", 0); // 1,000,000 bonds
    let currency_ = ethers.encodeBytes32String("USD"); // currency of the bond
    let unitVal_ = ethers.parseUnits("100", 0); // unit value for each bond => $100
    let couponRate_ = ethers.parseUnits("5", 0); // coupon rate
    let creationDate_ ;
    let issuanceDate_;
    let maturityDate_ ;
    let couponDates = [];
    let cutofftime_ ;

    const toSec = (asMs) => Math.floor(Number(asMs) / 1000 );
    const today = () => Math.floor(Date.now() / 1000);

    function makeBondDate(nbCoupons, couponSpaceSec) {
        const start = today();
        const coupons = [];
        let last = start;
      
        for (let i = 0; i < nbCoupons; i++) {
          last = last + couponSpaceSec;
          coupons.push(last);
        }

        console.log("last:",last);
      
        const maturity = last + couponSpaceSec;

        console.log("Maturity:",maturity);
      
        return {
          creationDate: toSec(Date.now()),
          issuanceDate: start,
          maturityDate: maturity,
          couponDates: coupons,
          defaultCutofftime: 17 * 3600
        };
      }

      const dates = makeBondDate(5, 1309402208-1309302208);


    //let recordDatetime_;

    creationDate_ = dates.creationDate;
    issuanceDate_ = dates.issuanceDate;
    maturityDate_ = dates.maturityDate;
    couponDates   = dates.couponDates;
    cutofftime_   = dates.defaultCutofftime;

    console.log("Creation Date:", creationDate_);
    console.log("Issuance Date:", issuanceDate_);
    console.log("Maturity Date:", maturityDate_);
    console.log("Coupon Dates:", couponDates);
    console.log("Record Datetime:", cutofftime_);
    //console.log(cheackNumber);

    // Deploy SmartContractAccessManagement
    const SmartContractAccessManagement = await ethers.getContractFactory("SmartContractAccessManagement");
    const smartContractAccessManagement = await SmartContractAccessManagement.deploy();
    await smartContractAccessManagement.waitForDeployment();
    console.log("SmartContractAccessManagement deployed to:", await smartContractAccessManagement.getAddress());

    // Deploy RegisterRoleManagement
    const RegisterRoleManagement = await ethers.getContractFactory("RegisterRoleManagement");
    const registerRoleManagement = await RegisterRoleManagement.deploy();
    await registerRoleManagement.waitForDeployment();
    console.log("RegisterRoleManagement contract deployed to:", await registerRoleManagement.getAddress());

    // Deploy Register
    const Register = await ethers.getContractFactory("Register");
    const register = await Register.deploy(
        name_,
        isin_,
        expectedSupply_,
        currency_,
        unitVal_,
        couponRate_,
        dates.creationDate,
        dates.issuanceDate,
        dates.maturityDate, // redemption
        dates.couponDates,
        dates.defaultCutofftime// Use recordDatetime_ instead of cutofftime_
    );

    await register.waitForDeployment();
    const registerAddress = await register.getAddress();
    console.log(`Register contract deployed to:`, registerAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
