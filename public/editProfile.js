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
