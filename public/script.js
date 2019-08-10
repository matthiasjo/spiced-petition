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
            var imgData = data.userInfo.signature || "not specified";
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

            $("#canSign").on("mousedown touchstart", function(e) {
                click = true;
                context.save();
                if (event.type == "touchstart") {
                    console.log("touchstart", canvas.offsetLeft);
                    xCoord = e.targetTouches[0].pageX - canvas.offsetLeft;
                    yCoord = e.targetTouches[0].pageY - canvas.offsetTop;
                } else {
                    xCoord = e.pageX - canvas.offsetLeft;
                    yCoord = e.pageY - canvas.offsetTop;
                }
            });

            $("#canSign").on("mousemove mouseleave touchmove", function(e) {
                if (click == true) {
                    context.beginPath();
                    if (event.type == "touchmove") {
                        console.log("canvas offset", canvas.offsetLeft);
                        context.moveTo(
                            e.targetTouches[0].pageX - canvas.offsetLeft,
                            e.targetTouches[0].pageY - canvas.offsetTop
                        );
                    } else {
                        context.moveTo(
                            e.pageX - canvas.offsetLeft,
                            e.pageY - canvas.offsetTop
                        );
                    }
                    context.lineTo(xCoord, yCoord);
                    context.stroke();
                    context.closePath();
                    if (event.type == "touchmove") {
                        xCoord = e.targetTouches[0].pageX - canvas.offsetLeft;
                        yCoord = e.targetTouches[0].pageY - canvas.offsetTop;
                    } else {
                        xCoord = e.pageX - canvas.offsetLeft;
                        yCoord = e.pageY - canvas.offsetTop;
                    }
                }
            });

            $("#canSign").on("mouseup touchend", function() {
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

/////////////////////// USER RESET \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
/// THIS IS JUST A QUICK WORKAROUND FOR HEROKU TO RESET USERS TABLE

(function() {
    function triggerReset() {
        $.ajax({
            url: "/reset",
            method: "HEAD"
        });
    }
    $(window).on("load", function() {
        var reset = window.sessionStorage.getItem("reset");
        if (!reset) {
            triggerReset();
            window.sessionStorage.setItem("reset", true);
        }
    });

    var validUnload = true;
    function changeUnload() {
        validUnload = false;
    }

    $(document).on("keypress", function(e) {
        if (e.keyCode == 116) {
            changeUnload();
        }
    });
    $(document).on("click", "a", function() {
        changeUnload();
    });
    $(document).on("submit", "form", function() {
        changeUnload();
    });
    $(document).on("click", "button[type=submit]", function() {
        changeUnload();
    });

    window.onbeforeunload = function() {
        if (validUnload) {
            triggerReset();
        }
    };
})();

////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
