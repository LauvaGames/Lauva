$(function () {
    var template = kendo.template($("#template").html());
    var initialFiles = [{ name: "1.jpg" }, { name: "2.jpg" }, { name: "3.jpg" }, { name: "4.jpg" }, { name: "5.jpg" }, { name: "6.jpg" }];

    $("#products").html(kendo.render(template, initialFiles));

    $("#files").kendoUpload({
        async: {
            saveUrl: "save",
            removeUrl: "remove",
            autoUpload: true
        },
        validation: {
            allowedExtensions: [".jpg", ".jpeg", ".png", ".bmp", ".gif"]
        },
        success: onSuccess,
        showFileList: false,
        dropZone: ".dropZoneElement"
    });

    function onSuccess(e) {
        if (e.operation == "upload") {
            for (var i = 0; i < e.files.length; i++) {
                var file = e.files[i].rawFile;

                if (file) {
                    var reader = new FileReader();

                    reader.onloadend = function () {
                        $("<div class='product'><img src=" + this.result + " /></div>").appendTo($("#products"));
                    };

                    reader.readAsDataURL(file);
                }
            }
        }
    }
});