document.addEventListener('DOMContentLoaded', (event) => {
    let yearSelect = document.getElementById('form_answer07');
    let monthSelect = document.getElementById('form_answer08');
    let daySelect = document.getElementById('form_answer09');

    for(let i = 1900; i <= new Date().getFullYear(); i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = i;
        yearSelect.add(option);
    }

    for(let i = 1; i <= 12; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = i;
        monthSelect.add(option);
    }

    function setDayOptions() {
        daySelect.innerHTML = '';
        let year = yearSelect.value;
        let month = monthSelect.value;
        let lastDay = new Date(year, month, 0).getDate();
        for(let i = 1; i <= lastDay; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.text = i;
            daySelect.add(option);
        }
    }

    yearSelect.addEventListener('change', setDayOptions);
    monthSelect.addEventListener('change', setDayOptions);
    
    setDayOptions();  // Initial call to populate the day select options based on the current year and month
});
