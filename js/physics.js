/*!
 * physics
 * Copyright(c) 2016 Adam York
 * MIT Licensed
 */

'use strict';

(function(scope) {

    function Physics(canvas, context) {
        this.GRAVITY = 0.3;
        this.SPRING = 0.06;
        this.FRICTION = 0.98;

        this.canvas = canvas;
        this.context = context;
        this.pixels = [];
        this.map = [];
        this.imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        this.frames = 0;

        for (var i = 0; i < this.imageData.width; i++) {
            var column = i;
            for (var j = 0; j < this.imageData.height; j++) {
                var row = j;
                var r = this.imageData.data[((row * (this.imageData.width * 4)) + (column * 4)) + 0];
                var g = this.imageData.data[((row * (this.imageData.width * 4)) + (column * 4)) + 1];
                var b = this.imageData.data[((row * (this.imageData.width * 4)) + (column * 4)) + 2];
                var a = this.imageData.data[((row * (this.imageData.width * 4)) + (column * 4)) + 3];
                var pixel = new window.PhysicsPixel(column, row, 0, 0, 0, 0, column, row, r, g, b, a);
                if (pixel.a !== 0) {
                    this.pixels.push(pixel);
                    this.map['x' + i + 'y' + j] = pixel;
                }
            }
        }

        $(document).mousemove(function(event) {
            this.mouseX = event.pageX;
            this.mouseY = event.pageY;
        }.bind(this));
    }

    Physics.prototype.start = function() {
        this.render();
    };

    Physics.prototype.render = function() {
        requestAnimationFrame(this.render.bind(this));
        var now = Date.now();
        var deltaTime = now - (this.time || now);

        this.time = now;

        var imgData = this.imageData;
        var data = imgData.data;

        this.pixels.forEach(function(pixel, i) {
            if (this.frames >= pixel.delay) {

                var originalX = pixel.x;
                var originalY = pixel.y;

                pixel.vx *= this.FRICTION + (this.FRICTION * (deltaTime / 1000));
                pixel.vy += this.GRAVITY + (this.GRAVITY * (deltaTime / 1000));

                pixel.x += Math.round(pixel.vx);
                pixel.y += Math.round(pixel.vy);

                var leftBounds = 0;
                var rightBounds = this.canvas.width;
                var bottomBounds = this.canvas.height;
                var topBounds = 0;

                var threshx = 1;
                var threshy = 1;
                //collision checking
                var destX;
                var destY;

                if ((pixel.x + threshx) > rightBounds) {
                    destX = rightBounds - threshx;
                    pixel.vx *= pixel.bounce;
                    this.checkCollisions(pixel, destX, pixel.y);
                } else if (pixel.x < leftBounds) {
                    destX = leftBounds;
                    pixel.vx *= pixel.bounce;
                    this.checkCollisions(pixel, destX, pixel.y);
                } else if ((pixel.y + threshy) > bottomBounds) {
                    destY = bottomBounds - threshy;
                    pixel.vy *= pixel.bounce;
                    this.checkCollisions(pixel, pixel.x, destY);
                } else if (pixel.y < topBounds) {
                    destY = topBounds;
                    pixel.vy *= pixel.bounce;
                    this.checkCollisions(pixel, pixel.x, destY);
                }

                data[((originalY * (imgData.width * 4)) + (originalX * 4)) + 3] = 0;

                data[((pixel.y * (imgData.width * 4)) + (pixel.x * 4)) + 0] = pixel.r;
                data[((pixel.y * (imgData.width * 4)) + (pixel.x * 4)) + 1] = pixel.g;
                data[((pixel.y * (imgData.width * 4)) + (pixel.x * 4)) + 2] = pixel.b;
                data[((pixel.y * (imgData.width * 4)) + (pixel.x * 4)) + 3] = pixel.a;
            }
        }.bind(this));
        this.context.putImageData(imgData, 0, 0);
        this.frames++;
    };

    Physics.prototype.checkCollisions = function(pixelA, destX, destY) {
        var pixelB = this.map['x' + destX + 'y' + destY];
        var dx, dy, dist, threshX, threshY, angle, tx, ty, ax, ay;
        if (pixelB) {
            dx = destX - pixelA.x;
            dy = destY - pixelA.y;
            dist = Math.sqrt((dx * dx) + (dy * dy));
            threshX = 2;
            threshY = 2;
            angle = Math.atan2(dy, dx);
            tx = pixelA.x + Math.cos(angle) * threshX;
            ty = pixelA.y + Math.sin(angle) * threshY;
            ax = (tx - pixelB.x) * this.SPRING;
            ay = (ty - pixelB.y) * this.SPRING;
            pixelA.vx -= ax;
            pixelA.vy -= ay;
            pixelB.vx += ax;
            pixelB.vy += ay;
        }
        pixelA.x = destX;
        pixelA.y = destY;
        this.map['x' + pixelA.x + 'y' + pixelA.y] = pixelA;
    };
    scope.Physics = Physics;
})(window);