let isAdvancedUpload = function() {
    let div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();

let $form = $('.box');

if (isAdvancedUpload) {
    $form.addClass('has-advanced-upload');

    let droppedFiles = false;

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
        
        droppedFiles = e.originalEvent.dataTransfer.files;
        console.log(droppedFiles[0]);

        console.log(typeof(e.originalEvent.dataTransfer.files));

        let rand = Date.now();

        for(let i = 0;i < droppedFiles.length;i++) {
            let file = droppedFiles[i];
            console.log(file.name);

            $("#uploading__list").append(`<div class="card mb-3" style="width: 100%;">
                    <div class="d-flex align-items-center">
                        <div>
                            <img  id='preview${rand+i}' src='images/spinner.jpg' class="card-img" alt="..." style="width: 80px; height: 100%;">
                        </div>
                        
                        <div class="progress m-2 w-100">
                            <div id='progress${rand+i}' class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                        </div>
                        
                    </div>
            </div>`);
            
            let reader = new FileReader();

            reader.addEventListener("load", function () {
                let preview = document.querySelector(`#preview${rand+i}`);
                console.log(preview);
                preview.src = reader.result;
            }, false);
            
            reader.readAsDataURL(file);
            
            let ajaxData = new FormData();
            ajaxData.append('image', file);
            console.log(ajaxData);

            $.ajax({
                url: $form.attr('action'),
                method: 'post',
                data: ajaxData,
                contentType: false,
                processData: false,
                
                complete: function() {
                    $form.removeClass('is-uploading');
                },
                success: function(data) {
                    $form.addClass( data.success == true ? 'is-success' : 'is-error' );
                },
                error: function() {

                },
                
                xhr: function () {
                    let xhr = new XMLHttpRequest();
        
                    xhr.upload.addEventListener('progress', function (event) {
                        let progressBar = $(`#progress${rand+i}`);
        
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
        }
        
    });

        
}

