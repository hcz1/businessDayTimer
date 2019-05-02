let data = {};

async function callData(){ 
  return fetch('https://www.gov.uk/bank-holidays.json')
        .then(res=>res.json())
};

function bankHolsLeft(date, data) {
  const bankHolidaysThisMonth = data['england-and-wales'].events.filter(group => {
    const bh = new Date(group.date);
    const yearAndMonth = bh.getFullYear() == date.getFullYear() && bh.getMonth() == date.getMonth();
    return yearAndMonth;
  } );
  return bankHolidaysThisMonth;
}
const getDaysInMonth = (year,month) => new Date(year, month, 0).getDate();

function getLastWorkingDay(date) {
  const dateLocal = new Date(date);
  let daysInMonth = getDaysInMonth(dateLocal.getFullYear(), dateLocal.getMonth()+1);
  dateLocal.setDate(daysInMonth);
  while(dateLocal.getDay() === 0 || dateLocal.getDay() === 6) {
    dateLocal.setDate(--daysInMonth);
  }
  return dateLocal;
}

const timeTil1800 = (date) => {
  const hoursleft = 17-date.getHours() > 0 ? 17-date.getHours() : 0;
  const minutesleft = date.getHours() < 18 ? 59-date.getMinutes() : 0;
  const secondsleft = date.getHours() < 18 ? 59-date.getSeconds() : 0;

  if(minutesleft<10) minutesleft = "0" + minutesleft;
  if(secondsleft<10) secondsleft = "0" + secondsleft;
  
  return hoursleft+"h : "+minutesleft+"m : "+secondsleft+"s"
}

const howManyWorkingDaysLeft = (date) => {
  const local = new Date(date)
  let count = 0;
  const month = local.getMonth();
  while(local.getMonth() === month){
    const dayOfMonth = local.getDate();
    local.setDate(dayOfMonth+1);
    if(local.getDay() !== 6 && local.getDay() !== 0){
      count++;
    }
  }
  return count;
}

const setTime = () => {
  const date = new Date();
  const bankHols = bankHolsLeft(date, data);
  const boolArrIfBankHolToday = bankHols.map(bankHol => bankHol.date === `${date.getFullYear()}-${date.getMonth() < 9 ? `0${date.getMonth()+1}` : date.getMonth()+1}-${date.getDate() < 9 ? `0${date.getDate()}` : date.getDate()}`);
  const isBankHol = boolArrIfBankHolToday.filter(Boolean)[0] || false;
  const bankHolsLeftThisMonth = bankHols.filter(group=>{
    const bh = new Date(group.date);
    return bh.getDate() > date.getDate();
  });
  const numBankHolsLeftThisMonth = bankHolsLeftThisMonth.length;
  const lastWorkingDate = getLastWorkingDay(date);
  const lastBankHolIndex = data['england-and-wales'].events.findIndex((group) => new Date(group.date) > date);
  const nextBankHol = data['england-and-wales'].events[lastBankHolIndex];
  const timer = timeTil1800(date);
  const workingDaysLeft = howManyWorkingDaysLeft(date);
  console.log(`${workingDaysLeft - numBankHolsLeftThisMonth} Days`);
  timeTilDate.textContent = `${lastWorkingDate.toDateString()}`
  if(date.getDay()=== 0 || date.getDay() === 6 ){
    console.log('Weekend');
  }else if(isBankHol){
    console.log('Bank Holiday');
  }else{
    console.log(timer);
  }
  console.log(`${nextBankHol.title})
	console.log(${new Date(nextBankHol.date).toDateString()}`);
}
//start timer 
(async () => {
  data = await callData();
  setTime();
  setInterval(async () => {
    setTime();
  },1000)
})();
