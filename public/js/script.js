
let id = 0
const table = document.getElementById("table");



function addRow(){
    let rows = table.rows.length -2;
    const row = table.insertRow(rows + 1);
    const description = row.insertCell(0);
    const quantity = row.insertCell(1);
    const rate = row.insertCell(2);
    const total = row.insertCell(3);
    description.outerHTML = `<th><input class="form-control col-5" type="text" name="invoice[details][description]" id="invoiceDescription${rows}" required></th>`;
    quantity.outerHTML = `<td><input class="form-control col-2" type="text" name="invoice[details][quantity]" id="invoiceQuantity${rows}" required></td>`;
    rate.outerHTML = `<td><input class="form-control col-2" type="text" name="invoice[details][rate]" id="invoiceRate${rows}" required onkeyup="getInfo(this)"></td>`;
    total.outerHTML = `<td class="col-3 text-end" id="invoiceTotal${rows}" onclick="getInfo(this)"></td>`;

}

function finalAmount() {
    const subtotal = document.getElementById('subtotal');
    let amount = 0;
    let rows = table.rows.length -2;
    const tax = document.getElementById('tax');
    const final = document.getElementById('final');

    for (let i = 0; i < rows; i++) {
        let total = document.getElementById(`invoiceTotal${i}`)
        // amount += parseFloat(total.innerHTML)
        amount += parseFloat(total.innerHTML)
        
    }

    subtotal.innerHTML = `$${parseFloat(amount).toFixed(2)}`
    tax.innerHTML = `${parseFloat(amount * .13).toFixed(2)}`
    const hst = tax.innerHTML
    const finalAmount = parseFloat(amount) + parseFloat(hst)
    final.innerHTML = `$${parseFloat(finalAmount).toFixed(2)}`;

}

function getInfo(total) {
    const el = document.getElementById(total.id)
    const parent = el.closest('tr')
    const qty = parent.children[1].childNodes[0].value;
    const rate = parent.children[2].childNodes[0].value;
    const subTotal = parent.children[3]
    subTotal.innerHTML = parseFloat(qty * rate).toFixed(2);
    finalAmount();
}

function generatePDF() {
    const element = document.getElementById('root');
    const opt = {
        margin: [.5, .5],
        jsPDF: {
            unit: 'in'
        }
    }

    html2pdf().set(opt).from(element).save();
}
