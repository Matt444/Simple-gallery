let images = []

fetch('/api/images').
then(json => json.json()).
then(data => {
    images = data;
    console.log(images);

    images.forEach(image => {

        $('#list').append(`
            <div id='card-${image.name}' class="card mb-3" style="width: 100%;">
                <div class="row no-gutters">
                    <div class="col-md-4 d-flex justify-content-center align-items-center">
                        <img src="${image.min_path}" class="" alt="..." style="max-height: 202px;">
                    </div>
                    <div class="col-md-6">
                        <div class="card-body">
                        
                        <form action="">
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="Input1">Signature:</label>
                                <div class="col-md-9">
                                    <input id="signature-${image.name}" class="form-control" type="text" placeholder="">
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="Input2">Categories:</label>
                                <div class="col-md-9">
                                    <div class="row ml-0" id="categories-list-${image.name}">
                                        
                                    </div>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="input">Enter category:</label>
                                <div class="input-group col-md-9">
                                    <input id="input-add-cat-${image.name}" class="form-control" id="input" type="text">
                                    <div class="input-group-append">
                                        <button id="bt-add-cat-${image.name}" class="btn btn-outline-secondary">Add</button>
                                    </div>
                                </div>
                            </div>

                        </form>
                        </div>
                    </div>
                    <div class="col-md-2 d-flex flex-column justify-content-center align-items-center">
                        <button id="bt-delete-${image.name}" type="button m-1" class="btn btn-danger m-2">Delete image</button>
                        <button id="bt-save-${image.name}" type="button m-1" class="btn btn-primary m-2">Save changes</button>
                    </div>
                </div>
        </div>`);

        // deactive save image option
        $("img").bind("contextmenu",function(e){
            return false;
        });

        $(`#signature-${image.name}`).val(image.signature);
        // updating list of categories
        image.categories.forEach(cat => {
            
            console.log('showing cat ' + cat);
            $(`#categories-list-${image.name}`).append(`
                <div class="alert alert-warning alert-dismissible fade show m-1 p-1 pr-3">
                    <span id="categories-name">${cat}</span>
                    <button id="bt-${image.name}-${cat}" type="button" class="close m-0 p-0 mt-1" data-dismiss="alert" aria-label="Close" >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);
            $(`#bt-${image.name}-${cat}`).on('click', () => {
                console.log("delete " + cat);
                let index = image.categories.indexOf(cat);
                if (index !== -1) image.categories.splice(index, 1);
                console.log(image.categories);
            });
        });

        $(`#bt-add-cat-${image.name}`).on('click', (e) =>  {
            e.preventDefault();
            let newcat = $(`#input-add-cat-${image.name}`).val();
            
            if(image.categories.indexOf(newcat) == -1) {
                $(`#categories-list-${image.name}`).append(`
                    <div class="alert alert-warning alert-dismissible fade show m-1 p-1 pr-3">
                        <span id="categories-name">${newcat}</span>
                        <button id="bt-${image.name}-${newcat}" type="button" class="close m-0 p-0 mt-1" data-dismiss="alert" aria-label="Close" >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `);
                $(`#bt-${image.name}-${newcat}`).on('click', () => {
                    console.log("delete " + newcat);
                    image.categories.pop(newcat);
                    console.log(image.categories);
                });
                image.categories.push(newcat);
                console.log(image.categories);
            }
        })

        $(`#bt-save-${image.name}`).on('click', (e) => {
            e.preventDefault();
            btn = $(`#bt-save-${image.name}`);
            btn.text('Updating');
            btn.removeClass('btn-primary');
            btn.addClass('btn-warning');
            image.signature = $(`#signature-${image.name}`).val();
            fetch('edit_images/update/image', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    image
                }),
            })
            .then(res => {
                if(res.status != 200) throw Error("server error");
                btn.text('Updated');
                btn.removeClass('btn-warning');
                btn.addClass('btn-success');
                setTimeout(() => {
                    btn.text('Save changes');
                    btn.removeClass('btn-success');
                    btn.addClass('btn-primary');
                }, 1000);
            })
            .catch(err => {
                console.log(err);
                btn.text('Error');
                btn.removeClass('btn-warning');
                btn.addClass('btn-danger');
                setTimeout(() => {
                    btn.text('Save changes');
                    btn.removeClass('btn-danger');
                    btn.addClass('btn-primary');
                }, 1000);
            });
        });

        $(`#bt-delete-${image.name}`).on('click', (e) => {
            e.preventDefault();
            fetch('edit_images/delete/image', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    image
                }),
            })
            .then(res => {
                
            })
            $(`#card-${image.name}`).remove();
        })
    });
});    



