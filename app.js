const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

const eventTitle = document.querySelector('#event-title');
const eventDate = document.querySelector('#event-date');
const eventPlace = document.querySelector('#event-place');
const eventDescription = document.querySelector('#event-description');
const showProgramButton = document.querySelector('#show-program');
const program = document.querySelector('#program');
const serviceForm = document.querySelector('#service-form');
const guide = document.querySelector('#guide');
const audio = document.querySelector('#audio');
const catalog = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

let data;
try {
  data = JSON.parse(sourceJson);
} catch {
  dataError.textContent = 'Ошибка данных.';
  dataError.hidden = false;
  showProgramButton.disabled = true;
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selected = { guide: guideChecked, audio: audioChecked, catalog: catalogChecked };
  const items = services
    .filter((service) => selected[service.id])
    .map(({ title, price }) => ({ title: title.trim(), price }));
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return { count: items.length, total, items };
}

function showProgram() {
  program.innerHTML = data.event.meeting;
  program.hidden = false;
  showProgramButton.setAttribute('aria-expanded', 'true');
}

function submitServices(event) {
  event.preventDefault();
  const report = buildReport(data.services, guide.checked, audio.checked, catalog.checked);

  if (report.count === 0) {
    choiceError.textContent = 'Выберите хотя бы одну услугу.';
    choiceError.hidden = false;
    result.hidden = true;
    reportJson.hidden = true;
    return;
  }

  const json = JSON.stringify(report);
  JSON.parse(json);

  result.innerHTML = [
    `Выбрано услуг: ${report.count}`,
    `Итого: ${report.total} руб.`,
    ...report.items.map((item) => item.title)
  ].join('<br>');
  reportJson.textContent = json;
  choiceError.hidden = true;
  result.hidden = false;
  reportJson.hidden = false;
}

if (data) {
  eventTitle.textContent = data.event.title;
  eventDate.textContent = data.event.date;
  eventPlace.textContent = data.event.place;
  eventDescription.textContent = data.event.description;
  showProgramButton.addEventListener('click', showProgram);
  serviceForm.addEventListener('submit', submitServices);
  serviceForm.hidden = false;
}
