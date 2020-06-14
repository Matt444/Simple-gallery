// Based on https://css-tricks.com/drag-and-drop-file-uploading/
let isAdvancedUpload = function() {
    let div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();

let $form = $('.box');

if (isAdvancedUpload) {
    $form.addClass('has-advanced-upload');

    $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
    })
    .on('dragover dragenter', function() {
        $form.addClass('is-dragover');
    })
    .on('dragleave dragend drop', function() {
        $form.removeClass('is-dragover');
    })
    .on('drop', function(e) {
        if ($form.hasClass('is-uploading')) return false;
        $form.addClass('is-uploading').removeClass('is-error');
        
        let droppedFiles = [];
        for(let i = 0;i < e.originalEvent.dataTransfer.files.length;i++)
            droppedFiles.push(e.originalEvent.dataTransfer.files[i]);

        let rand = Date.now();

        // Add file to list and load miniatures
        droppedFiles.map((file, index) => {
            $("#uploading__list").append(`<div class="card mb-3" style="width: 100%;">
                    <div class="d-flex align-items-center">
                        <div id="preview-${rand+index}" class="d-flex justify-content-center" style="width: 80px; height: 100%;">
                            <div class="spinner-border spinner-border-sm" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                        
                        <div class="progress m-2 w-100">
                            <div id='progress${rand+index}' class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                        </div>
                        
                    </div>
            </div>`);

            let reader = new FileReader();
            reader.addEventListener("load", function () {
                $(`#preview-${rand+index}>div`).remove();
                $(`#preview-${rand+index}`).append(`<img src="${reader.result}" class="card-img" alt="..." style="width: 80px; height: 100%;">`);
            }, false);
            
            reader.readAsDataURL(file);
        });

        // Send files to server with Ajax
        let promises = droppedFiles.map((file, index) => new Promise((resolve, reject) => {
            let ajaxData = new FormData();
            ajaxData.append('image', file);
            const progressBar = $(`#progress${rand+index}`);

            $.ajax({
                url: $form.attr('action'),
                method: 'post',
                data: ajaxData,
                contentType: false,
                processData: false,
                
                complete: function() {
                    resolve();
                },

                success: function(data) {
                    $form.addClass( data.success == true ? 'is-success' : 'is-error' );
                    progressBar.removeClass('bg-info');
                    progressBar.addClass('bg-success');    
                },

                error: () => reject("problem with server"),

                xhr: function () {
                    let xhr = new XMLHttpRequest();
                    xhr.upload.addEventListener('progress', function (event) {
                        if (event.lengthComputable) {
                            let percent = Math.floor((event.loaded / event.total) * 100);
                            console.log(percent);
                            progressBar.width(percent + '%');
                            progressBar.text(percent + '%');
                        }
                    });
                    return xhr;
                }
            });
        }));

        Promise.all(promises)
        .then(() => {
            $form.removeClass('is-uploading');
        })
        .catch(err => console.log(err));
    });
}

