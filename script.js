document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("add-produce-form");
    const produceList = document.getElementById("produce-list");

    let produceData = []; // Temporary storage

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const name = document.getElementById("produce-name").value;
        const price = document.getElementById("produce-price").value;

        const newProduce = { name, price };
        produceData.push(newProduce);
        
        updateProduceList();
        form.reset();
    });

    function updateProduceList() {
        produceList.innerHTML = "";
        produceData.forEach((item, index) => {
            const div = document.createElement("div");
            div.classList.add("produce-item");
            div.innerHTML = `<strong>${item.name}</strong> - ₹${item.price} per kg`;
            produceList.appendChild(div);
        });
    }
});
