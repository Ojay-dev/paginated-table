let currentPage = 1;
const data: Record<number, Record<string, unknown>[]> = {};

/**
 * We fetch the data, then render the current page
 */
function startApp() {
  fetchData(currentPage).then(() => {
    renderCurrent();
  });

  document
    .querySelector('[data-prevbtn]')
    ?.addEventListener('click', previousData);

  document.querySelector('[data-nextbtn]')?.addEventListener('click', nextData);
}

/**
 * It fetches data from an API and saves it in a global variable
 * @param {number} page - The page number to fetch.
 */
async function fetchData(page: number) {
  const response = await fetch(
    'https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=' + page
  );

  const { results } = await response.json();

  const [res] = results;
  Object.keys(res).forEach((key) => {
    data[key] = res[key];
  });
}

/**
 * Loop through data at currentPage and update dom
 */
function renderCurrent() {
  const tableBody: Element | null = document.querySelector('[data-sink]');

  const prevBtn = document.querySelector('[data-prevbtn]');

  if (tableBody !== null) {
    tableBody.innerHTML = '';
  }

  const tableData = data[currentPage];

  /* Looping through the tableData and adding the data to the tableBody. */
  for (let i = 0; i < tableData.length; i++) {
    const data = tableData[i];

    var row = `
          <tr data-entryid=${data.id}>
              <td>${data.row}</td>
              <td>${data.gender}</td>
              <td>${data.age}</td>
          </tr> `;

    if (tableBody !== null) {
      tableBody.innerHTML += row;
    }
  }

  if (currentPage <= 1) {
    // disable previous button
    prevBtn?.setAttribute('disabled', 'true');
  } else {
    prevBtn?.removeAttribute('disabled');
  }
}

/**
 * "Given a number, return true if it's odd, false otherwise."
 *
 * The function takes a number as an argument and returns true if it's odd, false otherwise
 * @param {number} number - number
 * @returns The function isOdd is being returned.
 */
function isOdd(number: number) {
  return number % 2 !== 0;
}

/**
 * If the current page is odd, we can just increment the page and render the current page. If the
 * current page is even, we need to fetch the next page of data before we can render the current page
 * @returns the value of the currentPage variable.
 */
function nextData() {
  if (isOdd(currentPage)) {
    currentPage += 1;
    renderCurrent();
    return;
  }

  currentPage += 1;
  fetchData(currentPage).then(() => {
    renderCurrent();
  });
}

/**
 * If the current page is odd, fetch the previous page and render the current page. If the current page
 * is even, just render the previous page
 * @returns the currentPage.
 */
function previousData() {
  if (currentPage <= 1) {
    return;
  }
  if (isOdd(currentPage)) {
    currentPage -= 2;
    fetchData(currentPage).then(() => {
      currentPage += 1;
      renderCurrent();
    });
    return;
  }

  currentPage -= 1;
  renderCurrent();
}

document.addEventListener('DOMContentLoaded', startApp);
