function checkCashRegister(price, cash, cid) {
  let change = cash - price;
  const changeArr = [];
  const values = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.1,
    "QUARTER": 0.25,
    "ONE": 1,
    "FIVE": 5,
    "TEN": 10,
    "TWENTY": 20,
    "ONE HUNDRED": 100
  }
  const balance = cid.reduce((sum, type) => {
    sum += type[1];
    return sum;
  }, 0);
  if (change > balance) return {status: "INSUFFICIENT_FUNDS", change: []};
  if (change == balance) return {status: "CLOSED", change: cid};

  for (let i = cid.length - 1; i >= 0 & change > 0; i--) {
    const value = values[cid[i][0]];
    let num = Math.floor(change / value);
    if (num * value > cid[i][1]) num = cid[i][1] / value;
    if (num >= 1) {
      change -= num * value;
      changeArr.push([cid[i][0], num * value]);
    }
  }
  // For floating point precision
  if (change < 0.01 & change >= 0.00999) {
    if (changeArr[changeArr.length - 1][0] == "PENNY") {
      changeArr[changeArr.length - 1][1] += 0.01;
    } else {
      changeArr.push(["PENNY", 0.01]);
    }
    change = 0;
  }

  if (change == 0) return {status: "OPEN", change: changeArr};
  return {status: "INSUFFICIENT_FUNDS", change: []};
}

checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);
