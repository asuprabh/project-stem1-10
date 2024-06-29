document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addFormulaForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const type = document.getElementById('type').value;
        let formula = document.getElementById('formula').value;
        const description = document.getElementById('description').value;

        function convertToSuperscript(str) {
            return str.replace(/\^(\d+)/g, '<sup>$1</sup>');
        }

        formula = convertToSuperscript(formula);

        const table = document.getElementById('formulaTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        const typeCell = newRow.insertCell(0);
        const formulaCell = newRow.insertCell(1);
        const descriptionCell = newRow.insertCell(2);
        const actionsCell = newRow.insertCell(3);

        typeCell.textContent = type;
        formulaCell.innerHTML = formula;
        descriptionCell.textContent = description;
        actionsCell.innerHTML = `
            <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</button>
        `;

        newRow.style.transition = 'opacity 0.3s ease-in-out';
        newRow.style.opacity = 0;
        setTimeout(() => newRow.style.opacity = 1, 10);

        document.getElementById('addFormulaForm').reset();

        actionsCell.querySelector('.deleteBtn').addEventListener('click', handleDelete);
        actionsCell.querySelector('.editBtn').addEventListener('click', handleEdit);
    });

    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', handleDelete);
    });

    document.querySelectorAll('.editBtn').forEach(button => {
        button.addEventListener('click', handleEdit);
    });

    let lastDeletedRow = null;

    function handleDelete(event) {
        const row = event.target.parentElement.parentElement;
        if (confirm("Are you sure you want to delete this formula?")) {
            lastDeletedRow = {
                row: row,
                type: row.cells[0].textContent,
                formula: row.cells[1].innerHTML,
                description: row.cells[2].textContent
            };

            row.style.transition = 'opacity 0.3s ease-in-out';
            row.style.opacity = 0;
            setTimeout(() => {
                row.parentElement.removeChild(row);
                showUndoButton();
            }, 300);
        }
    }

    function showUndoButton() {
        const undoButton = document.createElement('button');
        undoButton.textContent = "Undo Delete";
        undoButton.classList.add('undoBtn');
        document.querySelector('.container').appendChild(undoButton);
        undoButton.addEventListener('click', undoDelete);
    }

    function undoDelete() {
        if (lastDeletedRow) {
            const table = document.getElementById('formulaTable').getElementsByTagName('tbody')[0];
            const newRow = table.insertRow();
            newRow.style.opacity = 0;
            newRow.innerHTML = `
                <td>${lastDeletedRow.type}</td>
                <td>${lastDeletedRow.formula}</td>
                <td>${lastDeletedRow.description}</td>
                <td>
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete</button>
                </td>
            `;
            setTimeout(() => newRow.style.opacity = 1, 10);

            lastDeletedRow = null;
            const undoBtn = document.querySelector('.undoBtn');
            if (undoBtn) {
                undoBtn.parentElement.removeChild(undoBtn);
            }

            // Reattach event listeners to new edit and delete buttons
            newRow.querySelector('.editBtn').addEventListener('click', handleEdit);
            newRow.querySelector('.deleteBtn').addEventListener('click', handleDelete);
        }
    }

    function handleEdit(event) {
        const row = event.target.parentElement.parentElement;
        const type = row.cells[0].textContent;
        const formula = row.cells[1].innerHTML.replace(/<sup>(\d+)<\/sup>/g, '^$1');
        const description = row.cells[2].textContent;

        document.getElementById('editType').value = type;
        document.getElementById('editFormula').value = formula;
        document.getElementById('editDescription').value = description;

        document.getElementById('editFormulaForm').style.display = 'block';
        document.getElementById('addFormulaForm').style.display = 'none';

        document.getElementById('editFormulaForm').onsubmit = function(e) {
            e.preventDefault();
            row.cells[0].textContent = document.getElementById('editType').value;
            row.cells[1].innerHTML = convertToSuperscript(document.getElementById('editFormula').value);
            row.cells[2].textContent = document.getElementById('editDescription').value;
            document.getElementById('editFormulaForm').reset();
            document.getElementById('editFormulaForm').style.display = 'none';
            document.getElementById('addFormulaForm').style.display = 'block';
        };

        document.getElementById('cancelEdit').onclick = function() {
            document.getElementById('editFormulaForm').reset();
            document.getElementById('editFormulaForm').style.display = 'none';
            document.getElementById('addFormulaForm').style.display = 'block';
        };
    }

    function convertToSuperscript(str) {
        return str.replace(/\^(\d+)/g, '<sup>$1</sup>');
    }
});
