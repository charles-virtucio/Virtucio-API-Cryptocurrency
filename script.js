// Constants
const apiUrl = 'https://api.coingecko.com/api/v3/exchange_rates';
const perPage = 20;

// Variables
let page = 1;
let loading = false;
let endOfList = false;

// Elements
const cryptoList = document.getElementById('cryptoList');
const loadingMsg = document.getElementById('loading');
const endMessage = document.getElementById('endMessage');
const searchBox = document.getElementById('searchBox');
const searchButton = document.getElementById('searchButton');
const noResultsMessage = document.getElementById('noResultsMessage');

async function fetchData() {
    try {
        const response = await fetch(`${apiUrl}?page=${page}&per_page=${perPage}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching data:', error);
    }
}

function showLoading() {
    loadingMsg.style.display = 'block';
}

function hideLoading() {
    loadingMsg.style.display = 'none';
}

function showEndMessage() {
    endMessage.style.display = 'block';
}

function hideEndMessage() {
    endMessage.style.display = 'none';
}

function showNoResultsMessage() {
    noResultsMessage.style.display = 'block';
}

function hideNoResultsMessage() {
    noResultsMessage.style.display = 'none';
}

function renderRateItem(name, value, unit) {
    const listItem = document.createElement('li');
    listItem.innerText = `${name}: ${value} ${unit}`;
    cryptoList.appendChild(listItem);
}

function renderRateList(rates) {
    cryptoList.innerHTML = '';

    rates.forEach(rate => {
        renderRateItem(rate.name, rate.value, rate.unit);
    });
}

function filterList(query) {
    const items = Array.from(cryptoList.getElementsByTagName('li'));

    let resultsFound = false;

    items.forEach(item => {
        const name = item.innerText.toLowerCase();
        if (name.includes(query.toLowerCase())) {
            item.style.display = 'block';
            resultsFound = true;
        } else {
            item.style.display = 'none';
        }
    });

    if (!resultsFound) {
        showNoResultsMessage();
    } else {
        hideNoResultsMessage();
    }
}

async function loadNextPage() {
    if (loading || endOfList) return;
    loading = true;
    showLoading();

    const data = await fetchData();
    const rates = Object.entries(data.rates).map(([name, { value, unit }]) => ({ name, value, unit }));

    if (rates.length === 0) {
        endOfList = true;
        showEndMessage();
    } else {
        renderRateList(rates);
        page++;
    }

    loading = false;
    hideLoading();
}

searchButton.addEventListener('click', () => {
    const query = searchBox.value.trim();
    filterList(query);
});

searchBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchBox.value.trim();
        filterList(query);
        e.preventDefault();
    }
});
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadNextPage();
    }
});
loadNextPage();
