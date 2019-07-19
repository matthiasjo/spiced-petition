///////////////////////MAIN \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
(function() {
    $(document).ready(function() {
        var visited = getCookie("visited");
        if (!visited) {
            setTimeout(function() {
                $(".modal").addClass("is-active");
            }, 500);
        }
    });

    $("#cookieConsent").click(function() {
        var d = new Date();
        d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000);
        var expires = "expires=" + d.toUTCString();
        document.cookie = "visited" + "=" + true + ";" + expires + ";path=/";
        $(".modal").removeClass("is-active");
    });

    $("#cookieDecline").click(function() {
        history.go(-1);
    });

    $(".modal-close").click(function() {
        $(".modal").removeClass("is-active");
    });

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
})();
///////////////////////MAIN \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////EDIT PROFILE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
(function() {
    $("#download").click(function(e) {
        $("#download").addClass("is-loading");
        $.ajaxSetup({
            headers: { "X-CSRF-Token": $("input[name=_csrf]").val() }
        });
        e.preventDefault();
        $.post("/userInfo", function(data) {
            var doc = new jsPDF();
            var imgData = data.userInfo.signature;
            var city = data.userInfo.city || "not specified";
            var age = data.userInfo.age || "not specified";
            var url = data.userInfo.url || "not specified";
            var string =
                "Name: " +
                data.userInfo.name +
                "\n" +
                "Last Name: " +
                data.userInfo.surname +
                "\n" +
                "Email: " +
                data.userInfo.email +
                "\n" +
                "City: " +
                city +
                "\n" +
                "Age: " +
                age +
                "\n" +
                "Homepage: " +
                "\n" +
                url +
                "\n" +
                "Signature: " +
                "\n";
            doc.setFontSize(25);
            var splitText = doc.splitTextToSize(string, 500);
            doc.text(35, 25, splitText);
            doc.addImage(imgData, "JPEG", 15, 120);
            doc.save("userdata.pdf");
        });
        setTimeout(function() {
            $("#download").removeClass("is-loading");
        }, 1000);
    });
})();

//////////////////////////EDIT PROFILE \\\\\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////// SIGNATURE FIELD \\\\\\\\\\\\\\\\\\

(function() {
    $(document).ready(function() {
        if ($("canvas").length) {
            function isCanvasBlank() {
                return !canvas
                    .getContext("2d")
                    .getImageData(0, 0, canvas.width, canvas.height)
                    .data.some(channel => channel !== 0);
            }
            var click = false;
            var xCoord = 0;
            var yCoord = 0;
            var canvas = document.getElementById("canSign");
            var context = canvas.getContext("2d");
            context.lineWidth = 2;

            $("#canSign").mousedown(function(e) {
                click = true;
                context.save();
                xCoord = e.pageX - canvas.offsetLeft;
                yCoord = e.pageY - canvas.offsetTop;
            });

            $("#canSign").mousemove(function(e) {
                if (click == true) {
                    context.beginPath();
                    context.moveTo(
                        e.pageX - canvas.offsetLeft,
                        e.pageY - canvas.offsetTop
                    );
                    context.lineTo(xCoord, yCoord);
                    context.stroke();
                    context.closePath();
                    xCoord = e.pageX - canvas.offsetLeft;
                    yCoord = e.pageY - canvas.offsetTop;
                }
            });

            $("#canSign").mouseup(function() {
                click = false;
                if (!isCanvasBlank(canvas)) {
                    $("#signatureField").val(canvas.toDataURL());
                }
            });
        }

        // $("form").submit(function(e) {
        //     if ($("#signatureField").val() != "") {
        //         e.preventDefault();
        //         $.ajax({
        //             url: "/petition",
        //             method: "POST",
        //             data: JSON.stringify({
        //                 _csrf: $("#csurfval").val(),
        //                 signature: $("#signatureField").val()
        //             }),
        //             dataType: "json",
        //             contentType: "application/json",
        //             processData: false,
        //             success: function() {
        //                 window.location.replace("/petition/signed");
        //             }
        //         });
        //     }
        // });
    });
})();

/////////////////////// SIGNATURE FIELD \\\\\\\\\\\\\\\\\\\\\\\\\\\\
