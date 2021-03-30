// 渲染卡片
function renderTicket(arr) {
  let str = '';
  arr.forEach(item => {
    const content = `
      <li class="card">
        <div class="card-region">${item.area}</div>
        <div class="card-header">
          <img src="${item.imgUrl}"
                alt="">
        </div>
        <div class="card-main">
          <div class="card-rate">8.7</div>
          <h3>
            <a href="#">${item.name}</a>
          </h3>
          <p class="card-description">
          ${item.description}
          </p>
          <div class="card-footer">
            <p class="cardNum-text"><i class="fas fa-exclamation-circle"></i>剩下最後 <span>${item.group}</span> 組</p>
            <p>TWD<span class="card-price">$${item.price}</span></p>
          </div>
        </div>
      </li>
    `;
    str += content;
  })
  if (areaSelect.value === '地區搜尋') {
    cardList.innerHTML = '';
  } else {
    filterText.textContent = `本次搜尋共 ${arr.length} 筆資料`;
  }
  cardList.innerHTML = str;
  addTicketForm.reset();
}

function renderPieChart() {
  let obj = {};
  data.forEach(item => {
    obj[item.area] = (obj[item.area] ? obj[item.area] + 1 : 1);
  })
  const arr = Object.keys(obj);
  let areaArr = [];
  arr.forEach(item => {
    const arr = [item, obj[item]];
    areaArr.push(arr);
  });
  areaArr = [areaArr[1], areaArr[2], areaArr[0]];
  const chart = c3.generate({
    bindto: '#areaPieChart',
    data: {
      columns: areaArr,
      type: 'donut',
    },
    donut: {
      title: "分布圖",
      width: 7
    },
    color: {
      pattern: ['#26C0C7', '#5151D3', '#E68618']
    },
    size: {
      width: 160,
      height: 160
    },
  });
}

// 新增卡片
function addTicket() {
  const obj = {
    area: ticketArea.value,
    description: ticketDescription.value,
    id: Date.now(),
    imgUrl: ticketImgUrl.value,
    name: ticketName.value,
    group: parseInt(ticketNum.value),
    price: parseInt(ticketPrice.value),
    rate: parseInt(ticketRate.value),
  };
  const hasError = validate(false, obj);
  if (hasError) return;
  data.push(obj);
  renderTicket(data);
  renderPieChart();
}

// 驗證表單
function validate(e, obj) {
  if (!e) {
    const isEmpty = Object.values(obj).some(item => (item === 0 ? false : !item));  // 只寫 (item => !item) 金額0時無法新增
    const isNumZero = obj.group < 1;
    const isPriceZero = obj.price < 0;
    const isRateOutRange = obj.rate < 1 || obj.rate > 10;
    inputDoms.forEach(inputDom => {
      const alertDom = inputDom.parentNode.querySelector('.alert-message');
      if (inputDom === ticketNum && isNumZero) {
        alertDom.innerHTML = alertMessage('num');
      } else if (inputDom === ticketPrice && isPriceZero) {
        alertDom.innerHTML = alertMessage('price');
      } else if (inputDom === ticketRate && isRateOutRange) {
        alertDom.innerHTML = alertMessage('rate');
      } else if (!inputDom.value) {
        alertDom.innerHTML = alertMessage('noWords');
      } else {
        alertDom.innerHTML = '';
      }
    });
    return isEmpty || isNumZero || isPriceZero || isRateOutRange;
  }
  const alertDom = e.target.parentNode.querySelector('.alert-message');
  if (!e.target.value) {
    alertDom.innerHTML = alertMessage('noWords');
  } else {
    alertDom.innerHTML = '';
  }
}

// 驗證表單提示文字
function alertMessage(text) {
  const alertText = {
    num: '組數必須大於零!',
    price: '金額必須大於、等於零!',
    rate: '這個選項請輸入1~10!',
    noWords: '這個選項必填!',
  }
  return `<span class="alert-text">${alertText[text]}</span>`;
}

// 篩選地區
function filterArea(e) {
  const filterArr = data.filter(item => item.area.match(e.target.value));
  renderTicket(filterArr);
}

// Javascript執行位置
const addTicketForm = document.querySelector('#addTicketForm');
const ticketName = document.querySelector('#ticketName');
const ticketImgUrl = document.querySelector('#ticketImgUrl');
const ticketArea = document.querySelector('#ticketArea');
const ticketPrice = document.querySelector('#ticketPrice');
const ticketNum = document.querySelector('#ticketNum');
const ticketRate = document.querySelector('#ticketRate');
const ticketDescription = document.querySelector('#ticketDescription');
const inputDoms = document.querySelectorAll('[data-use="validate"]');
const addTicketBtn = document.querySelector('#addTicketBtn');
const areaSelect = document.querySelector('#areaSelect');
const cardList = document.querySelector('#cardList');
const filterText = document.querySelector('.filter-text');

let data = [];
const api = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json';
axios.get(api).then(res => {
  data = res.data.data;
  renderTicket(data);
  renderPieChart();
})

addTicketBtn.addEventListener('click', addTicket);
inputDoms.forEach(inputDom => inputDom.addEventListener('blur', validate));
areaSelect.addEventListener('change', filterArea);