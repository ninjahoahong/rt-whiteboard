var socket = io.connect('http://localhost:3000');

function drawPath(ctx, x, y) {
    if (typeof x === null || y === null) {
        ctx.beginPath();
        ctx.arc(x[0], x[1], 1, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        return;
    }
    ctx.beginPath();
    ctx.moveTo(x[0], x[1]);
    ctx.lineTo(y[0], y[1]);
    ctx.closePath();
    ctx.stroke();
}

$(function(){
    var canvas = document.getElementById('board');

    if (!canvas.getContext) {
        return;
    }

    var mousePressed = false;
    var lastpoint = null;
    var ctx = canvas.getContext('2d');

    var canvasX = $(canvas).offset().left;
    var canvasY = $(canvas).offset().top;

    ctx.strokeStyle = '000000';
    ctx.lineWidth = 5;

    $(canvas).mousedown(function(e) {
        mousePressed = true;
        lastpoint = [e.pageX - $(canvas).offset().left, e.pageY - $(canvas).offset().top];
        drawPath(ctx, lastpoint);
        socket.emit('draw', {
            a: lastpoint
        });
    });
    
    $(canvas).mouseup(function() {
        mousePressed = false;
        lastpoint = null;
    });
    
    $(canvas).mousemove(function(e) {
        if (mousePressed) {
            var p = [e.pageX - canvasX, e.pageY - canvasY];
            drawPath(ctx, p, lastpoint);
            socket.emit('draw', {
                a: p,
                b: lastpoint
            });
            lastpoint = p;
        }
    });

    socket.on('draw', function(data) {
        drawPath(ctx, data.a, data.b);
    });
});