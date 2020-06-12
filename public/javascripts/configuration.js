const widthElement = document.querySelector("#width");
const heightElement = document.querySelector("#height");
const radio1Element = document.querySelector("#mode1");
const radio2Element = document.querySelector("#mode2");
const updateButton = document.querySelector(".btn");

fetch('/api/config')
.then(data => data.json())
.then(json => {
    console.log(json);
    widthElement.setAttribute("value", json.width);
    heightElement.setAttribute("value", json.height);
    if(json.mode == 1) radio1Element.checked = true;
    else radio2Element.checked = true;
}).catch(err => console.log(err));

    updateButton.addEventListener('click', (e) => {
        e.preventDefault();
        updateButton.classList.remove('btn-primary');
        updateButton.classList.add('btn-warning');
        updateButton.textContent = 'Updating';
        const width = widthElement.value;
        const height = heightElement.value;
        let mode = 1;
        if(radio2Element.checked) mode = 2;

        fetch('/configuration/update', {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            width: Number(width),
            height: Number(height),
            mode
        }),
          
    }).then(res => {
        if(res.status != 200) throw new Error("server error");
        updateButton.classList.remove('btn-warning');
        updateButton.classList.add('btn-success');
        updateButton.textContent = 'Updated';
        setTimeout(() => {
            updateButton.classList.remove('btn-success');
            updateButton.classList.add('btn-primary');
            updateButton.textContent = 'Update';
        }, 1000);
        console.log(res);
    }).catch(err => {
        console.log(err);
        updateButton.classList.remove('btn-warning');
        updateButton.classList.add('btn-danger');
        updateButton.textContent = 'Error';
        setTimeout(() => {
            updateButton.classList.remove('btn-danger');
            updateButton.classList.add('btn-primary');
            updateButton.textContent = 'Update';
        }, 1000);
    })
})