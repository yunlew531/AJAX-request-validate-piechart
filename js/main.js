// 渲染旅遊卡片
function renderTourCard(arr) {
  const searchResultText = document.querySelector('#searchResult-text');
  const ticketCardArea = document.querySelector('.ticketCard-area');
  let str = '';
  arr.forEach(item => {
    const content = `
      <li class="ticketCard">
        <div class="ticketCard-img">
          <a href="#">
            <img src="${item.imgUrl}" alt="">
          </a>
          <div class="ticketCard-region">${item.area}</div>
          <div class="ticketCard-rank">${item.rate}</div>
        </div>
        <div class="ticketCard-content">
          <div>
            <h3>
              <a href="#" class="ticketCard-name">${item.name}</a>
            </h3>
            <p class="ticketCard-description">
              ${item.description}
            </p>
          </div>
          <div class="ticketCard-info">
            <p class="ticketCard-num">
              <span><i class="fas fa-exclamation-circle"></i></span>
              剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
            </p>
            <p class="ticketCard-price">
              TWD <span id="ticketCard-price">$${item.price}</span>
            </p>
          </div>
        </div>
      </li>
    `;
    str += content;
  });
  ticketCardArea.innerHTML = str;
  if (regionSearch.value !== '地區搜尋')
  searchResultText.textContent = `搜尋到 ${arr.length} 筆資料`;
}

// 新增套票
function addTourTicket() {
  const ticketName = document.querySelector('#ticketName');
  const ticketImgUrl = document.querySelector('#ticketImgUrl');
  const ticketRegion = document.querySelector('#ticketRegion');
  const ticketPrice = document.querySelector('#ticketPrice');
  const ticketNum = document.querySelector('#ticketNum');
  const ticketRate = document.querySelector('#ticketRate');
  const ticketDescription = document.querySelector('#ticketDescription');
  const addTicketForm = document.querySelector('.addTicket-form');
  const obj = {
    id: Date.now(),
    name: ticketName.value,
    imgUrl: ticketImgUrl.value,
    area: ticketRegion.value,
    description: ticketDescription.value,
    group: parseInt(ticketNum.value),
    price: parseInt(ticketPrice.value),
    rate: parseInt(ticketRate.value)
  };
  const hasError = validate(false, obj);  // 表單驗證
  if (hasError) return;
  data.push(obj);
  addTicketForm.reset();
  renderTourCard(data);
  renderChart();
}

// 表單驗證
function validate(event, obj) {
  if (!event) {
    const arr = Object.values(obj);
    const isEmpty = arr.some(item => !item);
    const isRateOutRange = (obj.rate < 1 || obj.rate > 10);
    const isGroupZero = obj.group < 1;
    const isPriceZero = obj.price < 1;
    inputDom.forEach(item => {
      const alertDom = item.parentNode.parentNode.querySelector('p');
      if (!item.value) {
        alertDom.innerHTML = validateMessage('empty');
      } else if (item === ticketRate && isRateOutRange) {
        alertDom.innerHTML = validateMessage('rate');
      } else if (item === ticketPrice && isPriceZero) {
        alertDom.innerHTML = validateMessage('priceZero');
      } else if (item === ticketNum && isGroupZero) {
        alertDom.innerHTML = validateMessage('NumZero');
      } else {
        alertDom.innerHTML = '';
      }
    });
    return (isEmpty || isRateOutRange || isGroupZero || isPriceZero);
  }
  const alertDom = event.target.parentNode.parentNode.querySelector('p');
  if (!event.target.value) {
    alertDom.innerHTML = validateMessage('empty');
  } else {
    alertDom.innerHTML = '';
  }
}

// 表單驗證提醒訊息
function validateMessage(text) {
  const obj = {
    empty: '這個選項必填!',
    priceZero: '金額必須大於零!',
    NumZero: '組數必須大於零!',
    rate: '這個選項請填寫1~10!'
  }
  return `<i class="fas fa-exclamation-circle"></i>
         <span>${obj[text]}</span>`;
}

// 篩選地區
function filterArea(e) {
  const filterAreaArr = data.filter(item => item.area.match(e.target.value))
  renderTourCard(filterAreaArr);
}

// 渲染圓餅圖
function renderChart() {
  let obj = {}
  data.forEach(item => {
    if (!obj[item.area]) 
      obj[item.area] = 0;
    obj[item.area]++;
  })
  let areaPieChartArr = [];
  const arr = Object.keys(obj);
  arr.forEach(item => {
    const arr = [];
    arr.push(item);
    arr.push(obj[item]);
    areaPieChartArr.push(arr);
  })
  areaPieChartArr = [areaPieChartArr[1], areaPieChartArr[2], areaPieChartArr[0]];
  const chart = c3.generate({
    bindto: ".pie-chart",
    data: {
      columns: areaPieChartArr,  // 格式 [["高雄", 2], ["台北",1], ["台中", 1]]
      type : 'donut',
    },
    donut: {
      title: "地區"
    }
  });
}

// JS執行位置
const addTicketBtn = document.querySelector('.addTicket-btn');
const inputDom = document.querySelectorAll('[data-use="validate"]');
const regionSearch = document.querySelector('.regionSearch');

let data = {};
const api = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json';
axios.get(api).then(res => {
  data = res.data.data;
  renderTourCard(data);
  renderChart()
})

regionSearch.addEventListener('change', filterArea);
addTicketBtn.addEventListener('click', addTourTicket);
inputDom.forEach(item => {
  item.addEventListener('blur', validate);
});