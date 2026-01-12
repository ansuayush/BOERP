/* dynamic-items-add-delete-only.js
   Plain ES6 JS: only Add (top row) and Delete (rows 2..n)
   Provides: init(options), bindAll(serverArray), getSavePayload(), saveToServer(url)
*/

document.addEventListener('DOMContentLoaded', () => {
    BOMTable.init({
        containerSelector: '#itemsTbody',
        useModalOnAdd: true // show your #confirmpopup modal after Add
    });
});

const BOMTable = (() => {
    let items = [];               // stored rows (positive DB ids, negative temp ids)
    let nextTempId = -1;          // use negative ids for new rows until server assigns
    let cfg = {};
    const currencyFormatter = v => '₹ ' + Number(v || 0).toFixed(2);

    function init(options = {}) {
        cfg = options;//fg
        renderTable();

        if (cfg.useModalOnAdd && document.querySelector('#confirmpopup')) {
            const yesBtn = document.querySelector('#confirmpopup .modal-footer .actionbtn');
            const noBtn = document.querySelector('#confirmpopup .modal-footer .cancelbtn');
            if (yesBtn) yesBtn.addEventListener('click', () => { clearTemplate(); $('#confirmpopup').modal('hide'); });
            if (noBtn) noBtn.addEventListener('click', () => { $('#confirmpopup').modal('hide'); });
        }
    }

    // === Public: bind all incoming server data (use when page is in edit mode) ===
    // serverArray: [ { id, fromClient, createNew, subcategory, itemCode, itemName, hsn, qty, uom, sellingPrice, totalCost } ]
    function bindAll(serverArray = []) {
        items = serverArray.map(s => ({
            id: Number(s.id),
            fromClient: !!s.fromClient,
            createNew: !!s.createNew,
            subcategory: s.subcategory || '',
            itemCode: s.itemCode || '',
            itemName: s.itemName || '',
            hsn: s.hsn || '',
            qty: Number(s.qty || 0),
            uom: s.uom || 'Pcs',
            sellingPrice: Number(s.sellingPrice || 0),
            totalCost: Number(s.totalCost || (Number(s.qty || 0) * Number(s.sellingPrice || 0)))
        }));
        renderTable();
    }

    // alias kept for clarity if you prefer previous name
    const bindData = bindAll;

    // === Public: prepare payload for saving ===
    function getSavePayload() {
        return items.map(it => ({
            id: it.id > 0 ? it.id : null,
            fromClient: !!it.fromClient,
            createNew: !!it.createNew,
            subcategory: it.subcategory,
            itemCode: it.itemCode,
            itemName: it.itemName,
            hsn: it.hsn,
            qty: it.qty,
            uom: it.uom,
            sellingPrice: it.sellingPrice,
            totalCost: it.totalCost
        }));
    }

    // optional helper to POST to server (adapt for CSRF tokens)
    async function saveToServer(saveUrl) {
        const payload = getSavePayload();
        try {
            const res = await fetch(saveUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data && data.success) {
                if (Array.isArray(data.saved)) {
                    bindAll(data.saved);
                } else {
                    alert('Saved successfully.');
                }
            } else {
                alert('Save failed: ' + (data && data.message ? data.message : 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Save request failed, see console.');
        }
    }

    // === Rendering ===
    function renderTable() {
        const tbody = document.querySelector(cfg.containerSelector);
        if (!tbody) return;
        tbody.innerHTML = '';

        // 1) template row (always row 1)
        tbody.insertAdjacentHTML('beforeend', templateRowHtml());
        bindTemplateEvents();

        // 2) data rows (start numbering from 2)
        items.forEach((row, idx) => {
            const displayIndex = idx + 2;
            tbody.insertAdjacentHTML('beforeend', dataRowHtml(row, displayIndex));
        });

        bindDataRowsEvents();
    }

    function templateRowHtml() {
        return `
      <tr id="templateRow">
        <td class="text-center">1</td>
        <td class="text-center"><input type="checkbox" class="tpl-fromClient"></td>
        <td class="text-center"><input type="checkbox" class="tpl-createNew"></td>
        <td><select class="form-control tpl-subcategory"><option value="">Select</option></select></td>
        <td><input type="text" class="form-control tpl-itemCode" placeholder="Enter"/></td>
        <td>
          <div class="autocomplete-wrapper" style="position: relative;">
            <label class="search-label"><img src="../../assets/images/icons/help/search-icon.png" class="icon-sm"></label>
            <input type="text" class="form-control tpl-itemName" placeholder="Type item..." autocomplete="off">
          </div>
        </td>
        <td><input type="text" inputmode="numeric" class="form-control tpl-hsn text-right" placeholder="Enter"></td>
        <td><input type="number" class="form-control tpl-qty text-right" placeholder="Enter"></td>
        <td><input type="text" class="form-control tpl-uom" value="Pcs" placeholder="UoM"></td>
        <td><input type="number" class="form-control tpl-selling text-right" placeholder="Enter"></td>
        <td class="text-right tpl-total">₹ 0.00</td>
        <td class="text-center">
          <button type="button" class="btn btn-sm actionbtn tpl-add">Add</button>
        </td>
      </tr>
    `;
    }

    function dataRowHtml(row, displayIndex) {
        return `
      <tr data-id="${row.id}">
        <td class="text-center">${displayIndex}</td>
        <td class="text-center"><input type="checkbox" ${row.fromClient ? 'checked' : ''} disabled></td>
        <td class="text-center"><input type="checkbox" ${row.createNew ? 'checked' : ''} disabled></td>
        <td>${escapeHtml(row.subcategory)}</td>
        <td>${escapeHtml(row.itemCode)}</td>
        <td>${escapeHtml(row.itemName)}</td>
        <td class="text-right">${escapeHtml(row.hsn)}</td>
        <td class="text-right">${row.qty}</td>
        <td>${escapeHtml(row.uom)}</td>
        <td class="text-right">${Number(row.sellingPrice).toFixed(2)}</td>
        <td class="text-right fn-bold">${currencyFormatter(row.totalCost)}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-danger row-delete">Delete</button>
        </td>
      </tr>
    `;
    }

    // === Template event bindings (Add + live total) ===
    function bindTemplateEvents() {
        const tpl = document.getElementById('templateRow');
        if (!tpl) return;

        const btnAdd = tpl.querySelector('.tpl-add');
        const qtyInput = tpl.querySelector('.tpl-qty');
        const sellInput = tpl.querySelector('.tpl-selling');
        const totalCell = tpl.querySelector('.tpl-total');

        // live calculation
        [qtyInput, sellInput].forEach(i => {
            if (!i) return;
            i.addEventListener('input', () => {
                const q = Number(qtyInput.value || 0);
                const s = Number(sellInput.value || 0);
                totalCell.textContent = currencyFormatter(q * s);
            });
        });

        if (btnAdd) btnAdd.addEventListener('click', onAddClicked);
    }

    function onAddClicked() {
        const tpl = document.getElementById('templateRow');
        const data = readTemplateValues(tpl);
        const err = validateRow(data);
        if (err) { alert(err); return; }

        data.totalCost = Number((data.qty * data.sellingPrice).toFixed(2));
        data.id = nextTempId--;
        items.push(data);
        renderTable();

        if (cfg.useModalOnAdd && document.querySelector('#confirmpopup')) {
            const h6span = document.querySelector('#confirmpopup .modal-body h6 span');
            if (h6span) h6span.innerText = `${data.itemCode || data.itemName} added successfully.`;
            $('#confirmpopup').modal('show');
        } else {
            alert(`${data.itemCode || data.itemName} added.`);
        }
    }

    function readTemplateValues(tpl) {
        return {
            id: null,
            fromClient: !!tpl.querySelector('.tpl-fromClient').checked,
            createNew: !!tpl.querySelector('.tpl-createNew').checked,
            subcategory: tpl.querySelector('.tpl-subcategory').value.trim(),
            itemCode: tpl.querySelector('.tpl-itemCode').value.trim(),
            itemName: tpl.querySelector('.tpl-itemName').value.trim(),
            hsn: tpl.querySelector('.tpl-hsn').value.trim(),
            qty: Number(tpl.querySelector('.tpl-qty').value || 0),
            uom: tpl.querySelector('.tpl-uom').value.trim() || 'Pcs',
            sellingPrice: Number(tpl.querySelector('.tpl-selling').value || 0),
            totalCost: 0
        };
    }

    function validateRow(data) {
        if (!data.itemName && !data.itemCode) return 'Enter item name or item code.';
        if (data.qty <= 0) return 'Quantity must be > 0.';
        return null;
    }

    function clearTemplate() {
        const tpl = document.getElementById('templateRow');
        if (!tpl) return;
        tpl.querySelectorAll('input[type="text"], input[type="number"]').forEach(i => i.value = '');
        tpl.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
        const uom = tpl.querySelector('.tpl-uom'); if (uom) uom.value = 'Pcs';
        const total = tpl.querySelector('.tpl-total'); if (total) total.textContent = currencyFormatter(0);
    }

    // === Data rows event bindings (Delete only) ===
    function bindDataRowsEvents() {
        const tbody = document.querySelector(cfg.containerSelector);
        if (!tbody) return;
        tbody.querySelectorAll('.row-delete').forEach(btn => {
            btn.removeEventListener('click', onDelete);
            btn.addEventListener('click', onDelete);
        });
    }

    function onDelete(e) {
        const tr = e.target.closest('tr');
        if (!tr) return;
        const id = Number(tr.getAttribute('data-id'));
        if (!confirm('Delete this item?')) return;
        items = items.filter(i => i.id !== id);
        renderTable();
    }

    function escapeHtml(s) {
        return (s === null || s === undefined) ? '' : String(s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // === Public API ===
    return {
        init,
        bindAll,     // call BOMTable.bindAll(serverArray) to load all rows when page is in edit mode
        bindData,    // alias
        getSavePayload,
        saveToServer
    };
})();
