(function() {
    $(document).ready(function() {
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
    });
})();
