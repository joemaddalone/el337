runAstroScript(() => {
	const c0 = document.getElementById("canvas-path-data");
	if (!c0) return; // Exit if elements aren't found (e.g. on other pages)

	const ctx0 = c0.getContext('2d');
	ctx0.beginPath();
	ctx0.moveTo(150, 10);
	ctx0.lineTo(115, 70);
	ctx0.lineTo(185, 70);
	ctx0.closePath();
	ctx0.stroke();

	const c1 = document.getElementById("ex2");
	if (c1) {
		const ctx1 = c1.getContext('2d');
		const p = new Path2D('M150 10 L115 70 L185 70 Z');
		ctx1.stroke(p);
	}

	const c2 = document.getElementById("ex3");
	if (c2) {
		const ctx2 = c2.getContext('2d');
		// Assuming 'path' class is available globally or defined elsewhere
		if (typeof path !== 'undefined') {
			const p1 = new Path2D(new path().triangle(70, 150, 50).toString());
			ctx2.stroke(p1);
		}
	}

	const c = document.getElementById("ex4");
	if (c) {
		let cx = 0;
		let cy = 0;
		let movex = 1;
		let movey = 1;
		const size = 20;
		const halfSize = size / 2;
		const ctx = c.getContext('2d');
		const outOfBounds = (pos, end) => pos + size > end || pos < 0;
		let animationId;

		const update = () => {
			ctx.clearRect(0, 0, c.width, c.height);
			movey = outOfBounds(cy + movey, c.height) ? -movey : movey;
			movex = outOfBounds(cx + movex, c.width) ? -movex : movex;
			cx += movex;
			cy += movey;

			if (typeof path !== 'undefined') {
				const sq = new path().square(size, cx + halfSize, cy + halfSize).toString();
				ctx.stroke(new Path2D(sq));
			}
			animationId = requestAnimationFrame(update);
		};

		update();

		const cleanup = () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
		return cleanup;
	}
});