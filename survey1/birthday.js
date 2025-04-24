// 生年月日セレクトボックスの初期化関数
function setupBirthdaySelects() {
    console.log("setupBirthdaySelects関数が呼び出されました");
    
    // 年セレクトボックスの設定
    const yearSelect = document.querySelector('.birthday-year');
    if (yearSelect) {
        // 現在の年を取得
        const currentYear = new Date().getFullYear();
        // 今年から100年前までの年を選択肢として追加
        for (let year = currentYear - 18; year >= currentYear - 100; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
        // デフォルトで2000年を選択
        yearSelect.value = 2000;
    } else {
        console.error("年セレクトボックスが見つかりません");
    }

    // 月セレクトボックスの設定
    const monthSelect = document.querySelector('.birthday-month');
    if (monthSelect) {
        // 1月から12月までの選択肢を追加
        for (let month = 1; month <= 12; month++) {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = month;
            monthSelect.appendChild(option);
        }
        // デフォルトで1月を選択
        monthSelect.value = 1;
    } else {
        console.error("月セレクトボックスが見つかりません");
    }

    // 日セレクトボックスの設定
    const daySelect = document.querySelector('.birthday-day');
    if (daySelect) {
        // 1日から31日までの選択肢を追加
        for (let day = 1; day <= 31; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            daySelect.appendChild(option);
        }
        // デフォルトで1日を選択
        daySelect.value = 1;
    } else {
        console.error("日セレクトボックスが見つかりません");
    }

    // 月が変わったときに、日の選択肢を更新する
    if (monthSelect && daySelect && yearSelect) {
        monthSelect.addEventListener('change', updateDays);
        yearSelect.addEventListener('change', updateDays);

        // 初期表示時にも日の選択肢を更新
        updateDays();
    }

    // 日の選択肢を更新する関数
    function updateDays() {
        // 現在選択されている年と月を取得
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        
        // 選択された月の日数を取得
        const daysInMonth = new Date(year, month, 0).getDate();
        
        // 現在選択されている日を取得（存在しない場合は1とする）
        const currentDay = parseInt(daySelect.value) || 1;
        
        // 日セレクトボックスをクリア
        daySelect.innerHTML = '';
        
        // 1日から月の日数までの選択肢を追加
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            daySelect.appendChild(option);
        }
        
        // 以前に選択されていた日が存在する場合はそれを選択、存在しない場合は月の最終日を選択
        if (currentDay <= daysInMonth) {
            daySelect.value = currentDay;
        } else {
            daySelect.value = daysInMonth;
        }
    }

    console.log("setupBirthdaySelects関数の実行が完了しました");
} 