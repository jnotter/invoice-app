
let id = 0
const table = document.getElementById("table");



function addRow(){
    let rows = table.rows.length -2;
    const row = table.insertRow(rows + 1);
    const description = row.insertCell(0);
    const quantity = row.insertCell(1);
    const rate = row.insertCell(2);
    const total = row.insertCell(3);
    description.outerHTML = `<th><input class="form-control col-5" type="text" name="invoice[details][description]" id="invoiceDescription${rows}" required control-id="ControlID-8"></th>`;
    quantity.outerHTML = `<td><input class="form-control col-2" type="text" name="invoice[details][quantity]" id="invoiceQuantity${rows}" required control-id="ControlID-9"></td>`;
    rate.outerHTML = `<td><input class="form-control col-2" type="text" name="invoice[details][rate]" id="invoiceRate${rows}" required onkeyup="getInfo(this)"></td>`;
    total.outerHTML = `<td class="col-3" id="invoiceTotal${rows}" onclick="getInfo(this)"></td>`;

}

function finalAmount() {
    const final = document.getElementById('final');
    let amount = 0
    let rows = table.rows.length -2

    for (let i = 0; i < rows; i++) {
        let total = document.getElementById(`invoiceTotal${i}`)
        // amount += parseFloat(total.innerHTML)
        amount += parseFloat(total.innerHTML)
        
    }

    final.innerHTML = `Subtotal: $${amount}`

}

function getInfo(total) {
    const el = document.getElementById(total.id)
    const parent = el.closest('tr')
    const qty = parent.children[1].childNodes[0].value;
    const rate = parent.children[2].childNodes[0].value;
    const subTotal = parent.children[3]
    subTotal.innerHTML = qty * rate
    finalAmount();
}
