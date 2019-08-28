/*!
 * physics
 * Copyright(c) 2016 Adam York
 * MIT Licensed
 */

'use strict';

(function(scope) {

    function Physics(canvasText, canvasEffect, contextText, contextEffect) {
        this.GRAVITY = 0.3;
        this.SPRING = 0.06;
        this.FRICTION = 0.98;
        this.SIZE = 10;

        this.canvasText = canvasText;
        this.canvasEffect = canvasEffect;
        this.contextText = contextText;
        this.contextEffect = contextEffect;
        this.effectData = this.contextEffect.getImageData(0, 0, this.canvasEffect.width, this.canvasEffect.height);
        this.pixels = [];
        this.map = [];
        this.frames = 0;

        $(document).click(function(event) {
            this.destroy(event.pageX, event.pageY);
        }.bind(this));
    }

    Physics.prototype.imageDataToPixels = function() {

    };

    Physics.prototype.destroy = function(x, y) {
        var colStart = x - (this.SIZE / 2);
        var colEnd = x + (this.SIZE / 2);
        var rowStart = y - (this.SIZE / 2);
        var rowEnd = y + (this.SIZE / 2);

        var targetData = this.contextText.getImageData(colStart, rowStart, this.SIZE, this.SIZE);

        for (var i = 0; i < this.SIZE; i++) {
            for (var j = 0; j < this.SIZE; j++) {
                var a = targetData.data[((i * (this.SIZE * 4)) + (j * 4)) + 3];
                if (a !== 0) {
                    var pixelX = colStart + j;
                    var pixelY = rowStart + i;
                    var r = targetData.data[((i * (targetData.width * 4)) + (j * 4))];
                    var g = targetData.data[((i * (targetData.width * 4)) + (j * 4)) + 1];
                    var b = targetData.data[((i * (targetData.width * 4)) + (j * 4)) + 2];
                    var pixel = new window.PhysicsPixel(pixelX, pixelY, r, g, b, a, i, j, this.SIZE);
                    pixel.time = this.time;
                    this.pixels.push(pixel);
                    targetData.data[((i * (targetData.width * 4)) + (j * 4)) + 3] = 0;
                    this.map['x' + pixelX + 'y' + pixelY] = pixel;
                }
            }
        }
        this.contextText.putImageData(targetData, x - (this.SIZE / 2), y - (this.SIZE / 2));
    };

    Physics.prototype.start = function() {
        this.render();
    };

    Physics.prototype.render = function() {
        requestAnimationFrame(this.render.bind(this));
        var now = Date.now();
        var deltaTime = now - (this.time || now);

        this.time = now;

        var imgData = this.effectData;
        var data = imgData.data;

        this.pixels.forEach(function(pixel, i) {
            if (this.time >= pixel.time + pixel.delay) {

                var originalX = pixel.x;
                var originalY = pixel.y;

                pixel.vx *= this.FRICTION + (this.FRICTION * (deltaTime / 1000));
                pixel.vy += this.GRAVITY + (this.GRAVITY * (deltaTime / 1000));

                pixel.x += Math.round(pixel.vx);
                pixel.y += Math.round(pixel.vy);

                var leftBounds = 0;
                var rightBounds = this.canvasEffect.width;
                var bottomBounds = this.canvasEffect.height;
                var topBounds = 0;

                var threshx = 1;
                var threshy = 1;
                //collision checking
                var destX;
                var destY;

                if ((pixel.x + threshx) > rightBounds) {
                    destX = rightBounds - threshx;
                    pixel.vx *= pixel.bounce;
                    //this.checkCollisions(pixel, destX, pixel.y);
                } else if (pixel.x < leftBounds) {
                    destX = leftBounds;
                    pixel.vx *= pixel.bounce;
                    //this.checkCollisions(pixel, destX, pixel.y);
                } else if ((pixel.y + threshy) > bottomBounds) {
                    destY = bottomBounds - threshy;
                    pixel.vy *= pixel.bounce;
                    //this.checkCollisions(pixel, pixel.x, destY);
                } else if (pixel.y < topBounds) {
                    destY = topBounds;
                    pixel.vy *= pixel.bounce;
                    //this.checkCollisions(pixel, pixel.x, destY);
                }

                data[((originalY * (imgData.width * 4)) + (originalX * 4)) + 3] = 0;
            }
            data[((pixel.y * (imgData.width * 4)) + (pixel.x * 4)) + 0] = pixel.r;
            data[((pixel.y * (imgData.width * 4)) + (pixel.x * 4)) + 1] = pixel.g;
            data[((pixel.y * (imgData.width * 4)) + (pixel.x * 4)) + 2] = pixel.b;
            data[((pixel.y * (imgData.width * 4)) + (pixel.x * 4)) + 3] = pixel.a;
        }.bind(this));
        this.contextEffect.putImageData(imgData, 0, 0);
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