let db;
const request = indexedDB.open("budget_tracker", 1);

request.onupgradeneeded = ({ target }) => {
    const db = target.result;
    db.createObjectStore("new_budget", { autoIncrement: true });
};

request.onsuccess = ({ target }) => {
    db = target.result;

    if (navigator.onLine) {
        //
    }
};

request.onerror = ({ target }) => {
    console.log(`${target.errorCode}`);
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record)
};

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if(getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, test/plain, */*", "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");

                store.clear();
            })
        }
    }
};

window.addEventListener("online", checkDatabase)